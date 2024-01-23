import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { confirmarCuentaEmail, emailRecuperarPassword } from "../helpers/email.js";

const registrar = async (req,res) => {
    const {email} = req.body;

    const existeUsuario = await Usuario.findOne({email: email})

    if(existeUsuario) {
        const error = new Error('E-mail ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token=generarId()
        await usuario.save()

        confirmarCuentaEmail({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json(await Usuario.findOne({_id: usuario._id}).select("nombre apellido email ").populate({
            path: "perfil",
            select: "nombre -_id", // Especifica los campos que deseas obtener del perfil
          }) )
        // res.json({msg:"Usuario Creado Correctamente"})

    } catch (error) {
        console.log(error)
    }
}

const obtenerUsuario = async (req, res) => {
    const {id} = req.params
    
    const usuarioExiste = await Usuario.findOne({_id:id})
    console.log(usuarioExiste)
    if(!usuarioExiste) {
        const error  = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message})
    }

    try {
        res.json(usuarioExiste);
    } catch (error) {
        console.log(error)
    }
}

const actualizarUsuario = async (req, res) => {
    const {id} = req.params
    const {nombre, apellido, email} = req.body
    try {
        const usuarioExiste = await Usuario.findOne({_id: id})
    
        if(!usuarioExiste) {
            const error = new Error("Usuario no existe")
            return res.status(404).json({msg: error.message})
        }

        usuarioExiste.nombre = nombre || usuarioExiste.nombre;
        usuarioExiste.apellido = apellido || usuarioExiste.apellido;
        usuarioExiste.email = email || usuarioExiste.email;

        const usuarioActualizado = await usuarioExiste.save()

        res.json(usuarioActualizado);
    } catch (error) {
        console.log(error)
    }
}

const actualizarEstado = async (req, res) => {
    try {
        const {id}=req.params
        const {estado} = req.body

        const usuarioExiste = await Usuario.findOne({_id: id})

        if(!usuarioExiste) {
            const error = new Error("Usuario no existe")
            return res.status(404).json({msg: error.message})
        }

        usuarioExiste.estado = estado
        await usuarioExiste.save()

        res.json(usuarioExiste)
    } catch (error) {
        console.log(error)
    }
}

const confirmarCuenta = async (req, res) => {
    const {token} =req.params
    const usuarioConfirmar = await Usuario.findOne({token: token})

    if(!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(403).json({msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado =true;
        usuarioConfirmar.token=""

        await usuarioConfirmar.save()
        
        res.json({msg:"Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const iniciarSesion = async (req, res) => {
    // 
    const {email, password} = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email: email}).populate("perfil")

    if(!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({msg: error.message})
    }

    // Comprobar si el usuario  esta confirmado
    if(!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmado");
        return res.status(403).json({msg: error.message})
    }

    if(!usuario.estado) {
        const error = new Error("Tu cuenta esta bloqueada");
        return res.status(403).json({msg: error.message})
    }

    // Comprobar su password
    if(await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            token: generarJWT(usuario._id),
            perfil: usuario.perfil
        })
    }else {
        const error = new Error("El password es Incorrecto");
        return res.status(403).json({msg: error.message})
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body

    const usuarioExiste = await Usuario.findOne({email})

    if(!usuarioExiste) {
        const error = new Error("Usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    // Comprobar si el usuario  esta confirmado
    if(!usuarioExiste.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmado");
        return res.status(403).json({msg: error.message})
    }

    if(!usuarioExiste.estado) {
        const error = new Error("Tu cuenta esta bloqueada");
        return res.status(403).json({msg: error.message})
    }

    try {
        usuarioExiste.token = generarId()
        await usuarioExiste.save()

        // Enviar el mail
        emailRecuperarPassword({
            email: usuarioExiste.email,
            nombre: usuarioExiste.nombre,
            token: usuarioExiste.token
        })

        res.json({msg:"Se ha enviado un email con las instrucciones"})
    } catch (error) {
        console.log(error)
    }
}

const verificarToken = async (req, res) => {
    const {token} = req.params

    const usuarioToken = await Usuario.findOne({token: token})

    if(usuarioToken) {
        res.json({msg: "Token válido y el usuario existe"})
        
    }else {
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password}=req.body

    const usuariotoken = await Usuario.findOne({token: token})
    if(usuariotoken) {
        usuariotoken.password = password
        usuariotoken.token=""
        try {
            await usuariotoken.save()
            res.json({msg:"Password correctamente modificado"})            
        } catch (error) {
            console.log(error)
        }
    }else {
        const error = new Error("Token no válido");
        return res.status(404).json({msg:error.message})
    }
}

const listarUsuarios = async (req, res) => {
    const usuarios = await Usuario.find().select("nombre apellido email ").populate({
        path: "perfil",
        select: "nombre -_id", // Especifica los campos que deseas obtener del perfil
      })

    res.json(usuarios)
}

export {
    registrar,
    obtenerUsuario,
    actualizarUsuario,
    actualizarEstado,
    confirmarCuenta,
    iniciarSesion,
    olvidePassword,
    verificarToken,
    nuevoPassword,
    listarUsuarios
}