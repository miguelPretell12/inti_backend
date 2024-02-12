import mongoose from "mongoose";

const paginaPerfilSchemma = mongoose.Schema({

},{
    timestamps: true
})

const PaginaPerfil  = mongoose.model("PaginaPerfil", paginaPerfilSchemma)

export default PaginaPerfil;