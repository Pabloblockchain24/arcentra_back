import User from "../models/user.model.js";
import Client from "../models/client.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { tipoUsuario: requesterRole } = req.user;

    // 🔐 1. SOLO ADMIN PUEDE CREAR USUARIOS
    if (requesterRole !== "admin") {
      return res.status(403).json({
        error: "No autorizado: solo admin puede crear usuarios"
      });
    }

    const {
      clienteNombre,
      password,
      tipoUsuario,
      email,
      nombre,
      apellido
    } = req.body;

    let clienteId = null;

    // 🔥 2. Si el usuario a crear es cliente → requiere client
    if (tipoUsuario === "cliente") {
      if (!clienteNombre) {
        return res.status(400).json({
          error: "clienteNombre es requerido para usuarios tipo cliente"
        });
      }

      const client = await Client.findOne({ nombre: clienteNombre });

      if (!client) {
        return res.status(404).json({
          error: "Cliente no encontrado"
        });
      }

      clienteId = client._id;
    }

    // 🔐 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 4. crear usuario
    const user = await User.create({
      email,
      nombre,
      apellido,
      password: hashedPassword,
      tipoUsuario,
      clienteId
    });

    // 🚫 no devolver password
    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(201).json(userSafe);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { tipoUsuario, clienteId } = req.user;

    let query = {};

    // 🔐 cliente solo ve usuarios de su empresa
    if (tipoUsuario === "cliente") {
      query.clienteId = clienteId;
    }

    const users = await User.find(query)
      .populate("clienteId", "nombre")
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("clienteId", "nombre")
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoUsuario: requesterRole } = req.user;
    const updates = req.body;

    if (requesterRole !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    delete updates._id;
    delete updates.password;

    // 🔐 si cambia password
    if (updates.newPassword) {
      updates.password = await bcrypt.hash(updates.newPassword, 10);
      delete updates.newPassword;
    }

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    )
      .populate("clienteId", "nombre")
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoUsuario: requesterRole } = req.user;

    // 🔐 solo admin
    if (requesterRole !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "Usuario eliminado permanentemente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoUsuario: requesterRole } = req.user;

    if (requesterRole !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { activo: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
