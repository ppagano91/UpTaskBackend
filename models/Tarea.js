import mongoose from "mongoose";

const tareaSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: Boolean,
      default: false,
    },
    fechaEntrega: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    prioridad: {
      type: String,
      required: true,
      enum: ["Baja", "Media", "Alta"],
    },
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    completado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to remove the task ID from associated projects when a task is deleted
/*
tareaSchema.pre("remove", async function (next) {
  const projectId = this.proyecto;
  try {
    // Find the associated project and remove the task ID from its 'tareas' array
    const project = await mongoose.model("Proyecto").findById(projectId);
    if (project) {
      project.tareas = project.tareas.filter(
        (tareaId) => tareaId.toString() !== this._id.toString()
      );
      await project.save();
    }
    next();
  } catch (err) {
    next(err);
  }
});
*/
const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;
