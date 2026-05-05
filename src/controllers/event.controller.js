import Event from "../models/event.model.js";
import Container from "../models/container.model.js";

// 🔥 CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const { tipoUsuario, clienteId: userClienteId } = req.user;

    const {
      unidad,
      tipo,
      fecha,
      hora,
      proveedor,
      chofer,
      patente,
      estado,
      observacion
    } = req.body;

    // 🔍 1. buscar container por unidad
    const container = await Container
      .findOne({ unidad });

    if (!container) {
      return res.status(404).json({ error: "Container no encontrado" });
    }

    // 🔐 2. multi-tenant
    if (
      tipoUsuario === "cliente" &&
      container.clienteId.toString() !== userClienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // 📦 3. crear event con ID real
    const event = await Event.create({
      containerId: container._id,
      clienteId: container.clienteId,
      tipo,
      fecha,
      hora,
      chofer,
      patente,
      proveedor,
      estado,
      observacion
    });

    res.status(201).json(event);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 GET ALL EVENTS
export const getEvents = async (req, res) => {
  try {
    const { tipoUsuario, clienteId } = req.user;

    let query = {};

    // 🔐 cliente solo ve lo suyo
    if (tipoUsuario === "cliente") {
      query.clienteId = clienteId;
    }

    const events = await Event.find(query)
      .populate("containerId", "unidad")
      .sort({ fecha: -1 });

    res.json(events);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔍 GET EVENT BY ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoUsuario, clienteId } = req.user;

    const event = await Event.findById(id)
      .populate("containerId", "unidad clienteId");

    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // 🔐 seguridad
    if (
      tipoUsuario === "cliente" &&
      event.clienteId.toString() !== clienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    res.json(event);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✏️ UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoUsuario, clienteId } = req.user;
    const updates = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // 🔐 seguridad
    if (
      tipoUsuario === "cliente" &&
      event.clienteId.toString() !== clienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    delete updates._id;
    delete updates.containerId;
    delete updates.clienteId;

    const updated = await Event.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🗑️ DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoUsuario, clienteId } = req.user;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // 🔐 seguridad
    if (
      tipoUsuario === "cliente" &&
      event.clienteId.toString() !== clienteId
    ) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await Event.findByIdAndDelete(id);

    res.json({ message: "Evento eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};