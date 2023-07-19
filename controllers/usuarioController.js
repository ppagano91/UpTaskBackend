import Usuario from '../models/usuario.js';

const usuarios = (req, res) => {
    res.json({msg:"GET API/USUARIOS"});
}

const registrar = async (req, res) => {
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