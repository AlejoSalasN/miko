import { createColumn, getColumnsByWorkspace, updateColumn, deleteColumn } from '../models/columnModel.js';
import { getWorkspaceById, isUserEditor } from '../models/workspaceModel.js';
import { getTasksByColumn } from '../models/taskModel.js';

// Crear una columna
export const createColumnController = async (req, reply) => {
  const { nombre, orden } = req.body;
  const { workspaceId } = req.params;
  const { id: userId } = req.user;

  if (!nombre || !orden) {
    return reply.status(400).send({ success: false, error: 'El nombre y la posición de la columna son obligatorios' });
  }

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    if (!workspace || workspace.id_usuario_propietario !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permiso para crear columnas en esta área de trabajo'
      });
    }
    const column = await createColumn(nombre, orden, workspaceId);
    reply.status(201).send({
      success: true,
      message: 'Columna creada con éxito',
      data: column
    });
  } catch (err) {
    console.error('Error al crear columna:', err);
    reply.status(500).send({ success: false, error: 'Error al crear la columna' });
  }
};

// Obtener columnas por área de trabajo
export const getColumnsController = async (req, reply) => {
  const { workspaceId } = req.params;
  const { id: userId } = req.user;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if ((!workspace && !isEditor) || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para visualizar columnas en esta área de trabajo',
      });
    }

    const columns = await getColumnsByWorkspace(workspaceId);
    reply.send({ success: true, message: 'Columnas obtenidad con éxito', data: columns });
  } catch (err) {
    console.error('Error al obtener columnas:', err)
    reply.status(500).send({ success: false, error: 'Error al obtener las columnas' });
  }
};

// Actualizar columna
export const updateColumnController = async (req, reply) => {
  const { workspaceId, id: columnId } = req.params;
  const { nombre, orden } = req.body;
  const { id: userId } = req.user;

  if ((!nombre && !orden) || nombre.trim() === "") {
    return reply.status(400).send({ success: false, error: 'Debes proporcionar un nuevo nombre u orden' })
  }

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    const isEditor = await isUserEditor(userId, workspaceId);
    if (!workspace || (workspace.id_usuario_propietario !== userId && isEditor.role !== 'editor')) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para actulizar columnas en esta área de trabajo',
      });
    }

    const column = await updateColumn(columnId, { nombre, orden });
    reply.send({
      success: true,
      message: 'Columna actualizada con éxito',
      data: column
    });
  } catch (err) {
    console.error('Error al actualizar columna:', err);
    reply.status(500).send({
      success: false,
      error: 'Error al actualizar columna'
    })
  }
}

// Eliminar una columna
export const deleteColumnController = async (req, reply) => {
  const { workspaceId, id: columnId } = req.params;
  const { id: userId } = req.user;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    if (!workspace || workspace.id_usuario_propietario !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permiso para eliminar esta columna',
      });
    }

    // Verificar si hay tareas asociadas a la columna
    const taskCount = await getTasksByColumn(columnId);
    if (taskCount > 0) {
      return reply.status(400).send({
        success: false,
        error: `No se puede eliminar la columna. Hay ${taskCount} tareas asociadas.`,
      });
    }

    // Eliminar la columna
    const result = await deleteColumn(columnId);
    if (!result) {
      return reply.status(404).send({
        success: false,
        error: 'La columna no fue encontrada',
      });
    }

    reply.status(200).send({
      success: true,
      message: 'Columna eliminada exitosamente',
    });
  } catch (err) {
    console.error('Error al eliminar columna:', err)
    reply.status(500).send({ success: false, error: 'Error al eliminar la columna' });
  }
};
