import Usuario from '../models/usuario.js';
import generarId from '../helpers/generar.js';

const usuarios = (req, res) => {
    res.json({msg:"GET API/USUARIOS"});
}

const registrar = async (req, res) => {
    // Evitar registros duplicados
    const {email} = req.body;
    const existeUsuario = await Usuario.findOne({email:email});

    if (existeUsuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg:error.message});
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioCreado = await usuario.save();

        console.log(usuario)
        res.json(usuarioCreado);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Hubo un error"});
        
    }
}

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    const usuario = await Usuario.findOne({email:email})
    if(!usuario) {
        const error = new Error("Usuario no registrado");
        return res.status(400).json({msg:error.message});
    }
    console.log(usuario);

    // Comprobar si el usuario existe
    if(!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg:error.message});
    }

    // Comprobar si el usuario está confirmado

    // Comprobar si el password es correcto
}

export {usuarios, registrar, autenticar};