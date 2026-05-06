import userService from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { createAccessToken } from "../libs/jwt.js"
import clientService from "../models/client.model.js";


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await userService
      .findOne({ email })
      .populate("clienteId", "nombre");

    if (!userFound) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 🔥 TOKEN COMPLETO (CLAVE)
    const payload = {
      id: userFound._id,
      clienteId: userFound.clienteId || null,
      tipoUsuario: userFound.tipoUsuario
    };

    const token = jwt.sign(payload, config.TOKEN_SECRET, {
      expiresIn: "1d"
    });

    const userResponse = {
      id: userFound._id,
      email: userFound.email,
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      empresa: userFound.clienteId?.nombre || null,
      tipoUsuario: userFound.tipoUsuario,
      clienteId: userFound.clienteId
    };

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true
      })
      .json({
        user: userResponse,
        token
      });

  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error });
  }
};


export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    })
    return res.sendStatus(200)
}

export const verifyToken =  async(req,res)=>{
    const {token} = req.cookies
    if(!token) return res.status(401).json({message: "unauthorized "})

    jwt.verify(token, config.TOKEN_SECRET, async (err,user)=>{
        if(err) return res.status(401).json({message: "unauthorized"})

        const userFound = await userService.findById(user.id)
        if (!userFound) return res.status(401).json({message: "unauthorized"})
   
        return res.json({
            id: userFound._id,
            email: userFound.email,
        })

    })
}