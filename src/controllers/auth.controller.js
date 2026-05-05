import userService from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import { createAccessToken } from "../libs/jwt.js"

export const register = async (req, res) => {
    const { email, password, empresa, nombre, apellido, tipoUsuario } = req.body
    try{
        const userFound = await userService.findOne({email})
        if (userFound) return res.status(400).json(["El email ya esta registrado"])
        const hash = await bcrypt.hash(password, 10)
        const newUser = await userService.create({ email, password: hash, empresa, nombre, apellido, tipoUsuario })
        const token = await createAccessToken({ id: newUser._id })
        res.cookie("token", token)
        res.json({
            email: newUser.email,
            empresa: newUser.empresa,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            tipoUsuario: newUser.tipoUsuario
        })
    }catch(error){
        console.log(error)
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const userFound = await userService.findOne({ email })
        if (!userFound) return res.status(401).json({ message: "Usuario no encontrado" })
        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" })
        jwt.sign(
            { id: userFound._id },
            config.TOKEN_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) {
                    console.error("Error al generar el token:", err, "TOKEN_SECRET:", config.TOKEN_SECRET);
                    return res.status(500).json({ message: "Error al generar el token", error: err });
                } else {
                    res.cookie("token", token, { sameSite: "none", secure: true }).json({data: {...userFound , token}});
                }
            }
        )
    } catch (error) {
        res.status(500).json({ message: "Error del servidor", error });
    }
}


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