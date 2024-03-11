import express from 'express'
import { registrar,crearColaborador,obtenerUsuario, actualizarEstado, actualizarUsuario, confirmarCuenta, iniciarSesion, olvidePassword, verificarToken, nuevoPassword, listarUsuarios, obtenerColaboradores, perfil } from '../controllers/UsuarioController.js'
import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

router.post("/login", iniciarSesion)
router.post("/crear",registrar)
router.post("/crear-colaborador", crearColaborador)
router.get("/obtener-usuario/:id",obtenerUsuario)
router.put("/:id", actualizarUsuario)
router.get("/listar-usuarios", listarUsuarios)
router.get("/verificar-token/:token", verificarToken)
router.post("/actualizar-estado/:id",actualizarEstado)
router.post("/confirmar-cuenta/:token", confirmarCuenta)
router.post("/olvide-password", olvidePassword)
router.post("/recuperar-password/:token", nuevoPassword)
router.get("/obtener-colaboradores/:id", obtenerColaboradores)
router.get('/perfil', checkAuth, perfil)

export default router