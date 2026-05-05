import Container from "../models/container.model.js";
import Client from "../models/client.model.js";
import Event from "../models/event.model.js";
import Billing from "../models/billing.model.js";

export const getContainerDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId, tipoUsuario } = req.user;
    let container = null;

    // 🔍 1. Buscar container
      container = await Container.findOne({ unidad: id }).populate("clienteId", "nombre");

    if (!container) {
      return res.status(404).json({ error: "Container no encontrado" });
    }

    // 🔐 2. Seguridad (multi-tenant)
    if (
      tipoUsuario === "cliente" &&
      container.clienteId._id.toString() !== clienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

const events = await Event.find({
  containerId: container._id   // 🔥 AQUÍ ESTÁ LA CLAVE
}).sort({ fecha: 1 });

const billing = await Billing.find({
  containerId: container._id   // 🔥 MISMO AQUÍ
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
    const { clienteId, rol } = req.user;

    let query = {};

    // 👇 Cliente normal → solo ve lo suyo
    if (rol === "cliente") {
      query.clienteId = clienteId;
    }

    // 👇 Admin → ve todo
    const containers = await Container.find(query)
      .sort({ createdAt: -1 });

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