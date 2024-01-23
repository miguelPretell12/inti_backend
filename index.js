import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import UsuarioRoutes from './routes/UsuarioRoutes.js'
import PerfilRoutes from './routes/PerfilRoutes.js'

const app = express();
app.use(express.json())
dotenv.config()

conectarDB()

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
            // Puede consultar la API
            callback(null, true)
        }else {
            // No esta permitido
            callback(new Error("Error de Cors"))
        }
    }
}

app.use(cors(corsOptions))

// Routing
app.use("/api/usuarios", UsuarioRoutes)
app.use("/api/perfil", PerfilRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})
