import Usuario from "../models/usuario.js";
import generarId from "../helpers/generar.js";
import generarJWT from "../helpers/generarJWT.js";

const usuarios = async (req, res) => {
  // Encotrar todos los usuarios
  const usuarios = await Usuario.find();
  res.json(usuarios);
};

const registrar = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email: email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioCreado = await usuario.save();
    res.json(usuarioCreado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email: email });
  if (!usuario) {
    const error = new Error("Usuario no registrado");
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Comprobar si el password es correcto
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("Password incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token: token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado" });
  } catch (error) {
    console.log(error);
  }
};

const recuperarPassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email: email });
  if (!usuario) {
    const error = new Error("Usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    res.json({
      msg: "Hemos enviado un email con las instrucciones para recuperar tu password",
    });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token: token });
  if (!tokenValido) {
    const error = new Error("Token no válido");
    return res.status(403).json({ msg: error.message });
  } else {
    res.json({ msg: "Token válido y el Usuario existe" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token: token });
  if (!usuario) {
    const error = new Error("Usuario no válido");
    return res.status(403).json({ msg: error.message });
  } else {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Password actualizado" });
    } catch (error) {
      console.log(error);
    }
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;

  res.json(usuario);
};

export {
  usuarios,
  registrar,
  autenticar,
  confirmar,
  recuperarPassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
