import { createTask, getTasks, getTaskById, updateTask, moveTask, deleteTask } from '../models/taskModel.js';
import { getWorkspaceById, isUserEditor } from '../models/workspaceModel.js';

// Crear una tarea
export const createTaskController = async (req, reply) => {
  const { titulo, descripcion, comentario } = req.body;
  const { workspaceId, columnId } = req.params;
  const { id: userId } = req.user;

  if (!titulo) {
    return reply.status(400).send({
      success: false,
      error: 'El título de la tarea es obligatorio'
    });
  }

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if (!workspace || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para crear tareas en esta área de trabajo',
      });
    }

    const task = await createTask(titulo, descripcion, comentario, columnId, workspaceId, userId);
    reply.status(201).send({
      success: true,
      message: 'Tarea creada exitosamente',
      data: task,
    });
  } catch (err) {
    console.error('Error al crear la tarea:', err);
    reply.status(500).send({
      success: false,
      error: 'Error al crear la tarea'
    });
  }
};

// Obtener tareas
export const getTasksByWorkspaceController = async (req, reply) => {
  const { workspaceId } = req.params;
  const { id: userId } = req.user;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if ((!workspace && !isEditor) || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para visualizar tareas de esta área de trabajo',
      });
    }

    const tasks = await getTasks(workspaceId);
    reply.send({
      success: true,
      message: 'Tareas obtenidas con éxito',
      data: tasks,
    });
  } catch (err) {
    console.error('Error al obtener las tareas', err)
    reply.status(500).send({ success: false, error: 'Error al obtener las tareas' });
  }
};

// Obtener una tarea
export const getTaskController = async (req, reply) => {
  const { workspaceId, id: taskId } = req.params;
  const { id: userId } = req.user;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if ((!workspace && !isEditor) || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para visualizar esta tarea en esta área de trabajo',
      });
    }

    const task = await getTaskById(taskId);
    reply.send({
      success: true,
      message: 'Tarea obtenida con éxito',
      data: task
    });
  } catch (err) {
    console.error('Error al obtener tarea:', err);
    reply.status(500).send({
      success: false,
      error: 'Error al obtener tarea'
    })
  }
}

// Modificar una tarea
export const updateTaskController = async (req, reply) => {
  const { workspaceId, id: taskId } = req.params;
  const { id: userId } = req.user;
  const { titulo, descripcion, comentario } = req.body;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if (!workspace || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para modificar esta tarea en esta área de trabajo',
      });
    }

    const task = await updateTask(taskId, { titulo, descripcion, comentario });
    reply.send({ success: true, message: 'Tarea actualizada con éxito', data: task });
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
    reply.status(500).send({ success: false, error: 'Error al actualizar tarea' });
  }
};

// Mover una tarea entre columnas
export const moveTaskController = async (req, reply) => {
  const { workspaceId, id: taskId } = req.params;
  const { id: userId } = req.user;
  const { newColumn } = req.body;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if (!workspace || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para modificar esta tarea en esta área de trabajo',
      });
    } 
    const task = await moveTask(taskId, newColumn);
    reply.send({ success: true, message: 'Tarea movida con éxito', data: task });
  } catch (err) {
    console.error('Error al mover tarea:', err);
    reply.status(500).send({ success: false, error: 'Error al mover tarea' });
  }
};

// Eliminar una tarea
export const deleteTaskController = async (req, reply) => {
  const { workspaceId, id: taskId } = req.params;
  const { id: userId } = req.user;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if (!workspace || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para eliminar esta tarea en esta área de trabajo',
      });
    } 

    const result = await deleteTask(taskId);

    if (!result) {
      return reply.status(404).send({
        success: false,
        error: 'Tarea no encontrada'
      });
    }

    reply.status(200).send({ success: true, message: 'Tarea eliminada exitosamente' });
  } catch (err) {
    console.error('Error al eliminar tarea:', err);
    reply.status(500).send({ success: false, error: 'Error al eliminar la tarea' });
  }
};
