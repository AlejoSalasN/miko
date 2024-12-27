import pool from '../config/database.js';

// Registrar una acción en la tabla audit_logs
export const logAction = async (action, userId, workspaceId = null, details = null) => {
  await pool.query(
    'INSERT INTO audit_logs (action, user_id, workspace_id, details) VALUES ($1, $2, $3, $4)',
    [action, userId, workspaceId, details]
  );
};
