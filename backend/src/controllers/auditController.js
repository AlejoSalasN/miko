import { logAction } from '../models/auditModel.js';

// Registrar una acción
export const auditLog = async (action, userId, workspaceId = null, details = null) => {
  try {
    await logAction(action, userId, workspaceId, details);
  } catch (err) {
    console.error('Error al registrar acción en audit_logs:', err);
  }
};
