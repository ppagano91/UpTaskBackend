import Usuario from '../models/usuario.js';
import generarId from '../helpers/generar.js';
import generarJWT from '../helpers/generarJWT.js';

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

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email:email})
    if(!usuario) {
        const error = new Error("Usuario no registrado");
        return res.status(400).json({msg:error.message});
    }
    console.log(usuario);
    
    // Comprobar si el usuario está confirmado
    if(!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada");
        return res.status(403).json({msg:error.message});
    }

    // Comprobar si el password es correcto
    if (await usuario.comprobarPassword(password)) {
        res.json({_id:usuario._id,
            nombre:usuario.nombre,
            email:usuario.email,
            token:generarJWT(usuario._id),           
        });
    }
    else{
        const error = new Error("Password incorrecto");
        return res.status(400).json({msg:error.message});
    }
}

const confirmar = async (req, res) => {    
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token:token});
    if(!usuarioConfirmar) {
        const error = new Error("Token no válido");
        return res.status(403).json({msg:error.message});
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg:"Usuario confirmado"});
        
    } catch (error) {
        console.log(error);                
    }    
}

export {usuarios, registrar, autenticar,confirmar};