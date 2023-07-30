import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/usuario.js";
import mongoose from "mongoose";

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find()
    .where("creador")
    .equals(req.usuario._id)
    .select("-tareas");
  // res.json({ msg: "Obtener proyectos" });
  res.json({ proyectos });
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  let proyecto;

  // Verificar si el id es válido
  if (mongoose.Types.ObjectId.isValid(id)) {
    // Obtener proyecto por id
    proyecto = await Proyecto.findById(id).populate("tareas");
  }

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // Comparar el id del creador del proyecto encontrado con el id del usuario autenticado
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no autorizada");
    return res.status(401).json({ msg: error.message });
  }

  // Obtener tareas del proyecto
  // const tareas = await Tarea.find().where("proyecto").equals(proyecto._id);

  // Opción 1
  // res.json({ proyecto, tareas });

  // Opción 2
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

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  let proyecto;

  // Verificar si el id es válido
  if (mongoose.Types.ObjectId.isValid(id)) {
    // Obtener proyecto por id
    proyecto = await Proyecto.findById(id);
  }

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // Comparar el id del creador del proyecto encontrado con el id del usuario autenticado
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no autorizada");
    return res.status(401).json({ msg: error.message });
  }

  // Actualizar proyecto
  proyecto.nombre = req.body.nombre || proyecto.nombre;
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
  proyecto.cliente = req.body.cliente || proyecto.cliente;

  try {
    const proyectoActualizado = await proyecto.save();
    res.json(proyectoActualizado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  let proyecto;

  // Verificar si el id es válido
  if (mongoose.Types.ObjectId.isValid(id)) {
    // Obtener proyecto por id
    proyecto = await Proyecto.findById(id);
  }

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // Comparar el id del creador del proyecto encontrado con el id del usuario autenticado
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no autorizada");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    res.json({ msg: "Proyecto eliminado", deleted: proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};

const buscarColaborador = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -password -token -updatedAt -createdAt -__v"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(usuario);
};

const agregarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // Comparar el id del creador del proyecto encontrado con el id del usuario autenticado
  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no autorizada");
    return res.status(401).json({ msg: error.message });
  }

  const { email } = req.body;

  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -password -token -updatedAt -createdAt -__v"
  );

  if (!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // Verificar que el colaborador no es el admin del proyecto
  if (usuario._id.toString() === proyecto.creador.toString()) {
    const error = new Error("El creador del proyecto no puede ser colaborador");
    return res.status(400).json({ msg: error.message });
  }

  // Verificar que el colaborador no esté ya en el proyecto
  if (proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El usuario ya es colaborador del proyecto");
    return res.status(400).json({ msg: error.message });
  }

  // Agregar colaborador al proyecto
  proyecto.colaboradores.push(usuario._id);

  await proyecto.save();

  console.log(req.body);

  res.json({ msg: "Colaborador Agregado Correctamente" });
};

const eliminarColaborador = async (req, res) => {
  res.json({ msg: "Eliminar colaborador" });
};

// No es necesario porque en /obtenerProyecto ya se obtienen las tareas
const obtenerTareas = async (req, res) => {
  const { id } = req.params;

  // Verificar si el id del proyecto es válido
  const exsiteProyecto = await Proyecto.findById(id);
  if (!exsiteProyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  // Tienes que ser creador del proyecto o colaborador para ver las tareas
  const tareas = await Tarea.find().where("proyecto").equals(id);

  res.json(tareas);
};

export {
  obtenerProyectos,
  obtenerProyecto,
  nuevoProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
};
