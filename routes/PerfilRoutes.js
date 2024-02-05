import express from "express";
import {crearPerfil,editarPerfil,habilitarPerfil,listarPerfil,obtenerPerfil} from '../controllers/PerfilController.js'

const router = express.Router()

router.post("/crear-perfil", crearPerfil)
router.get("/obtener-perfil/:id", obtenerPerfil)
router.put("/editar-perfil/:id", editarPerfil)
router.get("/listar-perfil",listarPerfil)
router.post("/estado-perfil/:id", habilitarPerfil)
export default router