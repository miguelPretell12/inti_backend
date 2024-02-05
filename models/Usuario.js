import mongoose from "mongoose";
import bcrypt from "bcrypt"

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    perfil : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Perfil"
    },
    encargado : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    },
    colaboradores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Usuario"
    }]
    
},{
    timestamps: true
});


usuarioSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password  =await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario
