import Usuario from '../models/usuario.js';

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
        const usuarioCreado = await usuario.save();

        console.log(usuario)
        res.json(usuarioCreado);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Hubo un error"});
        
    }

}

export {usuarios, registrar};