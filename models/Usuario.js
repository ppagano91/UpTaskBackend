import mongoose from "mongoose";
import bycrypt from "bcrypt";

const usuarioSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        token: {
            type: String,
        },

        confirmado: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }    
);

// Hashear password
usuarioSchema.pre("save", async function(next){
    // Si el password ya está hasheado
    if (!this.isModified("password")) {
        // Continuar con el siguiente middleware
        next();
    }
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password, salt);
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
