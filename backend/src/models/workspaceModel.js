import pool from '../config/database.js';

// Crear un área de trabajo
export const createWorkspace = async (nombre, descripcion, userId) => {
  const result = await pool.query(
    'INSERT INTO AreaTrabajo (nombre, descripcion, id_usuario_propietario) VALUES ($1, $2, $3) RETURNING id, nombre, descripcion, id_usuario_propietario',
    [nombre, descripcion, userId]
  );
  return result.rows[0];
};

// Obtener un área de trabajo validando al usuario
export const getWorkspaceById = async (workspaceId, userId) => {
  const result = await pool.query(
    `SELECT a.id, a.nombre, a.descripcion, a.id_usuario_propietario
    FROM AreaTrabajo a
    LEFT JOIN UsuarioAreaTrabajo uat ON a.id = uat.id_area_trabajo
    WHERE a.id = $1 AND (a.id_usuario_propietario = $2 OR uat.id_usuario = $2)`,
    [workspaceId, userId]
  );

  return result.rows[0];
}

// Verificar si un usuario es editor de un área de trabajo
export const isUserEditor = async (userId, workspaceId) => {
  const result = await pool.query(
    `SELECT role
    FROM UsuarioAreaTrabajo
    WHERE id_usuario = $1 AND id_area_trabajo = $2`,
    [userId, workspaceId]
  );
  return result.rows[0];
}

// Obtener áreas de trabajo por usuario
export const getWorkspacesByUser = async (userId) => {
  const result = await pool.query(
    `SELECT DISTINCT a.id, a.nombre, a.descripcion, a.id_usuario_propietario FROM AreaTrabajo a
    LEFT JOIN UsuarioAreaTrabajo uat ON a.id = uat.id_area_trabajo
    WHERE a.id_usuario_propietario = $1 OR uat.id_usuario = $1`,
    [userId]
  );
  return result.rows;
};

// Actualizar un área de trabajo
export const updateWorkspace = async (workspaceId, {nombre, descripcion}) => {
  const result = await pool.query(
    `UPDATE AreaTrabajo
    SET nombre = COALESCE($1, nombre), descripcion = COALESCE($2, descripcion)
    WHERE id = $3
    RETURNING id, nombre, descripcion id_usuario_propietario`,
    [nombre, descripcion, workspaceId]
  )
}

// Eliminar un área de trabajo
export const deleteWorkspace = async (workspaceId, userId) => {
  const result = await pool.query(
    `DELETE FROM AreaTrabajo
    WHERE id = $1 AND id_usuario_propietario = $2
    RETURNING id`, 
    [workspaceId, userId]
  );
  return result.rows[0]
};

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