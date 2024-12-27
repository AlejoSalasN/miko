import pool from '../config/database.js';

// Añadir colaborador a un área de trabajo
export const addCollaborator = async (workspaceId, collaboratorId, role) => {
  const result = await pool.query(
    `INSERT INTO UsuarioAreaTrabajo (id_usuario, id_area_trabajo, role)
    VALUES ($1, $2, $3)
    RETURNING id_usuario, id_area_trabajo, role`,
    [collaboratorId, workspaceId, role]
  );
  return result.rows[0];
}

// Modificar el rol de un colaborador
export const updateCollaboratorRole = async (workspaceId, collaboratorId, role) => {
  const result = await pool.query(
    `UPDATE UsuarioAreaTrabajo 
     SET role = $1 
     WHERE id_area_trabajo = $2 AND id_usuario = $3 
     RETURNING id_usuario`,
    [role, workspaceId, collaboratorId]
  );
  return result.rowCount > 0;
};

//Eiminar usuario de un área de trabajo
export const deleteCollaborator= async (workspaceId, collaboratorId) => {
  const result = await pool.query(
    `DELETE FROM UsuarioAreaTrabajo
    WHERE id_area_trabajo = $1 AND id_usuario = $2
    RETURNING id_usuario`, 
    [workspaceId, collaboratorId]
  );
  return result.rowCount > 0;
};