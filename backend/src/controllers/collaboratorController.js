import { addCollaborator, updateCollaboratorRole, deleteCollaborator } from '../models/collaboratorModel.js';
import { getWorkspaceById } from '../models/workspaceModel.js';
import { getUserByEmailCollaborator } from '../models/userModel.js';
import pool from '../config/database.js'

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

// Modificar el rol de un colaborador
export const updateCollaboratorRoleController = async (req, reply) => {
  const { id: workspaceId, collaboratorId } = req.params;
  const { role } = req.body;
  const { id: userId } = req.user;

  // Validar que el rol es válido
  const validRoles = ['editor', 'lector'];
  if (!validRoles.includes(role)) {
    return reply.status(400).send({
      success: false,
      error: `Rol inválido. Los roles permitidos son: ${validRoles.join(', ')}`,
    });
  }

  try {
    // Verificar si el usuario es el propietario del área de trabajo
    const workspace = await getWorkspaceById(workspaceId, userId);
    if (!workspace || workspace.id_usuario_propietario !== userId) {
      return reply.status(403).send({
        success: false,
        error: 'No tienes permisos para modificar roles en esta área de trabajo',
      });
    }

    // Actualizar el rol del colaborador
    const updated = await updateCollaboratorRole(workspaceId, collaboratorId, role);
    if (!updated) {
      return reply.status(404).send({
        success: false,
        error: 'Colaborador no encontrado en esta área de trabajo',
      });
    }

    reply.status(200).send({
      success: true,
      message: 'Rol del colaborador actualizado con éxito',
    });
  } catch (err) {
    console.error('Error al actualizar el rol del colaborador:', err);
    reply.status(500).send({ success: false, error: 'Error al actualizar el rol del colaborador' });
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
