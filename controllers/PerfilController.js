import Perfil from "../models/Perfil.js";

const crearPerfil = async (req, res) => {
    const { nombre, descripcion, codigo } =req.body

    const ExistePerfil = Perfil.findOne({codigo})

    // Comprobar si el perfil ya existe
    if(!ExistePerfil){
        const error = new Error("E perfil ya existe")
        return res.status(404).json({msg: error.message})
    }

    try {
        const perf = new Perfil(req.body)
        await perf.save()

        res.json(perf)

    } catch (error) {
        console.log(error)
    }
}

const obtenerPerfil = async ( req, res) => {
    const {id} = req.params

    const PerfilExiste = await Perfil.findOne({_id: id})

    if(!PerfilExiste) {
        const error = new Error("Perfil no existe")
        return res.status(404).json({msg: error.message})
    }

    try {
        res.json(PerfilExiste)
    }catch(error) {
        console.log(error)
    }
}

const editarPerfil = async (req, res) => {
    const {id} = req.params

    const PerfilExiste = await Perfil.findOne({_id: id})

    if(!PerfilExiste) {
        const error = new Error("Perfil no existe")
        return res.status(404).json({msg: error.message})
    }

    try {
        PerfilExiste.nombre = req.body.nombre || PerfilExiste.nombre;
        PerfilExiste.descripcion = req.body.descripcion || PerfilExiste.descripcion
        PerfilExiste.codigo = req.body.codigo || PerfilExiste.codigo
        const perfilActualizado = await PerfilExiste.save()

        res.json(perfilActualizado)
    } catch (error) {
        console.log(error)
    }
}

const habilitarPerfil = async (req, res) => {
    const {id} = req.params
    try {
        const perfil = await Perfil.findOne({_id: id})
        perfil.habilitado = !perfil.habilitado
        await perfil.save()
        res.json(perfil)
    } catch (error) {
        
    }
}

const listarPerfil = async (req, res) => {
    const listar = await Perfil.find()

    res.json(listar)
}

export {
    crearPerfil,
    obtenerPerfil,
    editarPerfil,
    habilitarPerfil,
    listarPerfil
}