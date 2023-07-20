import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerTarea = async (req, res) => {};

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;

  const exsiteProyecto = await Proyecto.findById(proyecto);

  if (!exsiteProyecto) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (exsiteProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no autorizada");
    return res.status(404).json({ msg: error.message });
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
