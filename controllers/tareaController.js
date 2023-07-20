import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

import mongoose from "mongoose";

const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  let tarea;

  // Verificar si el id es válido
  if (mongoose.Types.ObjectId.isValid(id)) {
    // populate("proyecto") es para que me traiga el proyecto al que pertenece la tarea
    tarea = await Tarea.findById(id).populate("proyecto");
  }

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }
  console.log(tarea);

  res.json(tarea);
};

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;

  const exsiteProyecto = await Proyecto.findById(proyecto);

  if (!exsiteProyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (exsiteProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos para añadir tarea");
    return res.status(403).json({ msg: error.message });
  }
  try {
    // const tareaAlmacenada = await tarea.save();
    const tareaAlmacenada = await Tarea.create(req.body);
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
  console.log(exsiteProyecto);
};

const actualizarTarea = async (req, res) => {};

const eliminarTarea = async (req, res) => {};

const cambiarEstadoTarea = async (req, res) => {};

export {
  obtenerTarea,
  agregarTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoTarea,
};
