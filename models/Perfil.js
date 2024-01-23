import mongoose, { mongo } from "mongoose";

const perfilSchemma = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    codigo:{
        type: String,
        trim: true
    },
    habilitado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const Perfil  = mongoose.model("Perfil", perfilSchemma)

export default Perfil;
