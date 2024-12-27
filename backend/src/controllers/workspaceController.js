import { createWorkspace, getWorkspacesByUser, deleteWorkspace, getWorkspaceById, updateWorkspace, addCollaborator, deleteCollaborator } from '../models/workspaceModel.js';
import { getUserByEmailCollaborator } from '../models/userModel.js';
import pool from '../config/database.js';
//import { auditLog } from './auditController.js';

// Crear un área de trabajo
export const createWorkspaceController = async (req, reply) => {
  const { nombre, descripcion } = req.body;
  const { id: userId } = req.user;

  if (!nombre) {
    return reply.status(400).send({ success: false, error: 'El nombre del área de trabajo es obligatorio' });
  }

  try {
    const workspace = await createWorkspace(nombre, descripcion, userId);

    // Registrar acción
    //await auditLog('WORKSPACE_CREATED', userId, workspace.id, `Área de trabajo creada: ${nombre}`);

    reply.status(201).send({ success: true, message: 'Área de trabajo creada con éxito', data: workspace });
  } catch (err) {
    reply.status(500).send({ success: false, error: 'Error al crear el área de trabajo' });
  }
};

//Obtener un área de trabajo basado  en su id
export const getWorkspaceByIdController = async (req, reply) => {
  const { id: workspaceId } = req.params;
  const { id: userId } = req.user;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);

    if (!workspace) {
      return reply.status(404).send({ success: false, error: 'Área de trabajo no encontrada o no tienes acceso' });
    }

    reply.send({ success: true, message: 'Área de trabajo obtenida con éxito', data: workspace });
  } catch (err) {
    console.log('Error al obtener el área de trabajo:', err);
    reply.status(500).send({ success: false, error: 'Error al obtener el área de trabajo' })
  }
}

// Obtener áreas de trabajo
export const getWorkspacesController = async (req, reply) => {
  const { id: userId } = req.user;

  try {
    const workspaces = await getWorkspacesByUser(userId);
    reply.send({ success: true, message: 'Áreas de trabajo obtenidas', data: workspaces });
  } catch (err) {
    console.error('Error al obtener las áreas de trabajo:', err)
    reply.status(500).send({ success: false, error: 'Error al obtener las áreas de trabajo' });
  }
};

// Actualizar un área de trabajo
export const updateWorkspaceController = async (req, reply) => {
  const { id: workspaceId } = req.params;
  const { nombre, descripcion } = req.body;
  const { id: userId } = req.user;

  if ((!nombre && !descripcion) || nombre.trim() === "") {
    return reply.status(400).send({ success: false, error: 'Debes proporcionar un nuevo nombre o descripción' })
  }

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    if (!workspace || workspace.id_usuario_propietario !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permiso para actualizar esta área de trabajo'
      })
    }

    const updatedWorkspace = await updateWorkspace(workspaceId, { nombre, descripcion });
    reply.send({
      success: true,
      message: 'Área de trabajo actualizada con éxito',
      data: updatedWorkspace
    });
  } catch (err) {
    console.error('Error al actualizar el área de trabajo:', err);
    reply.status(500).send({ success: false, error: 'Error al actualziar el área de tranajo' })
  }

}

// Eliminar un área de trabajo
export const deleteWorkspaceController = async (req, reply) => {
  const { id: workspaceId } = req.params;
  const { id: userId } = req.user;

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    
    if (!workspace || workspace.id_usuario_propietario !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permiso para actualizar esta área de trabajo'
      })
    }

    await deleteWorkspace(workspaceId, userId);
    reply.status(200).send({ success: true, message: 'Área de trabajo eliminada exitosamente' });
  } catch (err) {
    console.error('Error al eliminar el área de trabajo:', err);
    reply.status(500).send({ success: false, error: 'Error al eliminar el área de trabajo' });
  }
};

// Añadir colaborador

export const addCollaboratorController = async (req, reply) => {
  const { id: workspaceId } = req.params;
  const { collaboratorEmail, role } = req.body;
  const { id: userId } = req.user;

  if (!collaboratorEmail || !['editor', 'lector'].includes(role)) {
    return reply.status(400).send({
      success: false,
      error: 'Debes proporcionar un colaborador válido y un rol (editor o lector)',
    });
  }

  try {
    // Verificar permisos del propietario
    const workspace = await getWorkspaceById(workspaceId, userId);
    if (!workspace || workspace.id_usuario_propietario !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para añadir colaboradores',
      });
    }

    // Obtener colaborador por email
    const collaborator = await getUserByEmailCollaborator(collaboratorEmail);
    if (!collaborator) {
      return reply.status(404).send({
        success: false,
        error: 'El colaborador no existe o el email proporcionado es incorrecto',
      });
    }

    const { id: collaboratorId } = collaborator;

    // Verificar duplicidad de colaborador
    const isCollaborator = await pool.query(
      `SELECT 1 FROM UsuarioAreaTrabajo 
       WHERE id_area_trabajo = $1 AND id_usuario = $2`,
      [workspaceId, collaboratorId]
    );

    if (isCollaborator.rowCount > 0) {
      return reply.status(400).send({
        success: false,
        error: 'El colaborador ya está asociado a esta área de trabajo',
      });
    }

    // Añadir colaborador
    const newCollaborator = await addCollaborator(workspaceId, collaboratorId, role);
    reply.status(201).send({
      success: true,
      message: 'Colaborador añadido con éxito',
      data: newCollaborator,
    });
  } catch (err) {
    console.error('Error al añadir colaborador:', err);
    reply.status(500).send({ success: false, error: 'Error al añadir colaborador' });
  }
};


// Eliminar a un colaborador
export const deleteCollaboratorController = async (req, reply) => {
  const { id: workspaceId } = req.params;
  const { collaboratorEmail } = req.body;
  const { id: userId } = req.user;

  if (!collaboratorEmail) {
    return reply.status(400).send({
      success: false,
      error: "Debes proporcionar el email del colaborador que desea eliminar"
    });
  }

  try {
    const workspace = await getWorkspaceById(workspaceId, userId);
    if (!workspace || workspace.id_usuario_propietario !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para eliminar colaboradores de esta área de trabajo'
      });
    }

    const collaborator = await getUserByEmailCollaborator(collaboratorEmail);
    if (!collaborator) {
      return reply.status(404).send({
        success: false,
        error: 'El colaborador no existe o el email proporcionado es incorrecto'
      });
    }

    const { id:collaboratorId } = collaborator;

    const result = await deleteCollaborator(workspaceId, collaboratorId);

    if (!result) {
      return reply.status(404).send({
        success: false,
        error: 'El colaborador no está asociado a esta área de trabajo'
      });
    }
    
    reply.status(200).send({ success: true, message: 'Colaborador eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar al colaborador:', err);
    reply.status(500).send({ success: false, error: 'Error al eliminar al colaborador' });
  }
}
