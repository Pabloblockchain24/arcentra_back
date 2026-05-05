import Container from "../models/container.model.js";
import Client from "../models/client.model.js";
import Event from "../models/event.model.js";
import Billing from "../models/billing.model.js";
import mongoose from "mongoose";

export const getContainerDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId, tipoUsuario } = req.user;
    const containerDoc = await Container
      .findOne({ unidad: id })
      .populate("clienteId", "nombre");

    if (!containerDoc) {
      return res.status(404).json({ error: "Container no encontrado" });
    }

    // 🔐 2. Seguridad (multi-tenant)
    if (
      tipoUsuario === "cliente" &&
      containerDoc.clienteId._id.toString() !== clienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }
    
        const container = containerDoc.toObject();
    delete container.deposito;

const events = await Event.find({
  containerId: containerDoc._id   // 🔥 AQUÍ ESTÁ LA CLAVE
}).sort({ fecha: 1 });

const billing = await Billing.find({
  containerId: containerDoc._id   // 🔥 MISMO AQUÍ
});

    // 🧠 5. Estado calculado (🔥)
    const estado = calcularEstado(events);

    // 💸 6. Resumen financiero
    const resumenFinanciero = calcularFinanzas(billing);

    res.json({
      container,
      estado,
      events,
      billing,
      resumenFinanciero
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContainers = async (req, res) => {
  try {
    const { clienteId, tipoUsuario } = req.user;

    // 🔥 CONVERSIÓN CLAVE
    const clienteObjectId = new mongoose.Types.ObjectId(clienteId);

    let query = {
      isDeleted: { $ne: true }
    };

    // 🔐 FILTRO REAL (ahora sí funciona)
    if (tipoUsuario === "cliente") {
      query.clienteId = clienteObjectId;
    }

    // 📦 containers
    const containersDocs = await Container
      .find(query)
      .populate("clienteId", "nombre")
      .sort({ createdAt: -1 });

    const containerIds = containersDocs.map(c => c._id);

    // 📍 events
    const events = await Event.find({
      containerId: { $in: containerIds }
    }).sort({ fecha: 1 });

    // 💰 billing
    const billing = await Billing.find({
      containerId: { $in: containerIds }
    });

    // 🧠 maps
    const eventsMap = {};
    const billingMap = {};

    events.forEach(e => {
      const key = e.containerId.toString();
      if (!eventsMap[key]) eventsMap[key] = [];
      eventsMap[key].push(e);
    });

    billing.forEach(b => {
      const key = b.containerId.toString();
      if (!billingMap[key]) billingMap[key] = [];
      billingMap[key].push(b);
    });

    // 🔥 response
    const containers = containersDocs.map(doc => {
      const obj = doc.toObject();
      delete obj.deposito;

      const id = doc._id.toString();

      const containerEvents = eventsMap[id] || [];
      const containerBilling = billingMap[id] || [];

      return {
        ...obj,
        events: containerEvents,
        billing: containerBilling,
        estado: calcularEstado(containerEvents),
        resumenFinanciero: calcularFinanzas(containerBilling)
      };
    });

    res.json(containers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createContainer = async (req, res) => {
  try {
    const { clienteNombre, ...data } = req.body;

    const client = await Client.findOne({ nombre: clienteNombre });

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const container = await Container.create({
      ...data,
      clienteId: client._id
    });

    res.status(201).json(container);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContainer = async (req, res) => {

  try {
    const { id } = req.params; // unidad
    const { clienteId, tipoUsuario } = req.user;
    const updates = req.body;

    // 🔍 1. Buscar container por unidad
    const container = await Container.findOne({ unidad: id });

    if (!container) {
      return res.status(404).json({ error: "Container no encontrado" });
    }

    // 🔐 2. Seguridad
    if (
      tipoUsuario === "cliente" &&
      container.clienteId.toString() !== clienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // ⚠️ 3. Evitar cambios críticos
    delete updates._id;
    delete updates.clienteId;

    // 🛠 4. Actualizar
    const updatedContainer = await Container.findByIdAndUpdate(
      container._id,
      updates,
      { new: true }
    );

    res.json(updatedContainer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContainer = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId, tipoUsuario } = req.user;

    // 🔍 1. Buscar container
    const container = await Container.findOne({ unidad: id });

    if (!container) {
      return res.status(404).json({ error: "Container no encontrado" });
    }

    // 🔐 2. Seguridad
    if (
      tipoUsuario === "cliente" &&
      container.clienteId.toString() !== clienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // 🗑 3. Soft delete
    container.isDeleted = true;
    await container.save();

    res.json({ message: "Container eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const calcularEstado = (events) => {
  if (!events.length) return "creado";

  const hasRetiro = events.some(
    e => e.tipo === "retiro_puerto" && e.estado === "completado"
  );

  const hasEntrega = events.some(
    e => e.tipo === "entrega_cd" && e.estado === "completado"
  );

  const hasDevolucion = events.some(
    e => e.tipo === "devolucion_vacio" && e.estado === "completado"
  );

  if (!hasRetiro) return "en_puerto";
  if (hasRetiro && !hasEntrega) return "en_transito";
  if (hasEntrega && !hasDevolucion) return "entregado";
  if (hasDevolucion) return "cerrado";

  return "en_proceso";
};


const calcularFinanzas = (billing) => {
  let ingresos = 0;
  let costos = 0;

  billing.forEach(b => {
    if (b.tipo === "cliente") ingresos += b.monto;
    else costos += b.monto;
  });

  return {
    ingresos,
    costos,
    margen: ingresos - costos
  };
};