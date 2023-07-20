import Proyecto from "../models/Proyecto.js";
import mongoose from "mongoose";
const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find()
    .where("creador")
    .equals(req.usuario._id);
  // res.json({ msg: "Obtener proyectos" });
  res.json({ proyectos });
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  // Encontrar proyecto por id
  let proyecto;

  if (mongoose.Types.ObjectId.isValid(id)) {
    // Obtener proyecto por id
    proyecto = await Proyecto.findById(id);
  }

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // console.log(proyecto.creador);
  // console.log(req.usuario._id);

  // Comparar el id del creador del proyecto encontrado con el id del usuario autenticado
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no autorizada");
    return res.status(401).json({ msg: error.message });
  }
  res.json(proyecto);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;
  try {
    const proyectoAlmacenado = await proyecto.save();
    res.json(proyectoAlmacenado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const editarProyecto = async (req, res) => {};

const eliminarProyecto = async (req, res) => {};

const agregarColaborador = async (req, res) => {};

const eliminarColaborador = async (req, res) => {};

const obtenerTareas = async (req, res) => {};

export {
  obtenerProyectos,
  obtenerProyecto,
  nuevoProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
};
