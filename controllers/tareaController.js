import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

import mongoose from "mongoose";

const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  let tarea;

  // Verificar si el id es válido
  if (mongoose.Types.ObjectId.isValid(id)) {
    // populate("proyecto") es para que me traiga el proyecto al que pertenece la tarea
    tarea = await Tarea.findById(id).populate("proyecto", "nombre");
  }

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

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
    // Almacenar el ID en el proyecto
    exsiteProyecto.tareas.push(tareaAlmacenada._id);
    await exsiteProyecto.save();

    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
  // console.log(exsiteProyecto);
};

const actualizarTarea = async (req, res) => {
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

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const tareaActualizada = await tarea.save();
    res.json(tareaActualizada);
  } catch (error) {
    console.log(error);
    error = new Error("Hubo un error");
    return res.status(500).json({ msg: error.message });
  }
};

const eliminarTarea = async (req, res) => {
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

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);

    Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);

    res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    error = new Error("Hubo un error");
    return res.status(500).json({ msg: error.message });
  }
};

const cambiarEstadoTarea = async (req, res) => {
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

  if (
    tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;

  await tarea.save();
  //res.json(tarea);

  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado");

  res.json(tareaAlmacenada);
};

export {
  obtenerTarea,
  agregarTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoTarea,
};
