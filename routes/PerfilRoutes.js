import express from "express";
import {crearPerfil,editarPerfil,listarPerfil,obtenerPerfil} from '../controllers/PerfilController.js'

const router = express.Router()

router.post("/crear-perfil", crearPerfil)
router.get("/obtener-perfil/:id", obtenerPerfil)
router.put("/editar-perfil/:id", editarPerfil)
router.get("/listar-perfil",listarPerfil)
export default router