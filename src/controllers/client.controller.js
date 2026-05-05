import Client from "../models/client.model.js";


// 🔥 CREATE
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 📦 GET ALL (activos por defecto)

export const getClients = async (req, res) => {
  try {
    const clients = await Client
      .find()
      .sort({ createdAt: -1 });

    res.json(clients);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔍 GET BY ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(client);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✏️ UPDATE
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 🔐 evitar cambios críticos
    delete updates._id;

    const client = await Client.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(client);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🗑️ DELETE (soft delete recomendado)
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente desactivado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔄 REACTIVAR CLIENTE
export const reactivateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(client);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};