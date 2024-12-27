import pool from '../config/database.js';

// Crear una tarea
export const createTask = async (titulo, descripcion, comentario, columnId, workspaceId, userId) => {
  const result = await pool.query(
    `INSERT INTO Tarea (titulo, descripcion, comentario, columna, id_area_trabajo, id_usuario_creador)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, titulo, descripcion, comentario, columna, id_area_trabajo, id_usuario_creador`,
    [titulo, descripcion, comentario, columnId, workspaceId, userId]
  );
  return result.rows[0];
};

// Obtener tareas
export const getTasks = async (workspaceId) => {
  const result = await pool.query(
    `SELECT id, titulo, descripcion, comentario, columna, id_area_trabajo, id_usuario_creador
    FROM Tarea
    WHERE id_area_trabajo = $1`,
    [workspaceId]
  );
  return result.rows;
};

// Obtener tareas mediante columna
export const getTasksByColumn = async (columna) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS task_count
     FROM Tarea
     WHERE columna = $1`,
    [columna]
  );
  return parseInt(result.rows[0].task_count, 10);
}

// Obtener solo una tarea por id
export const getTaskById = async (taskId) => {
  const result = await pool.query(
    `SELECT id, titulo, descripcion, comentario, columna, id_area_trabajo, id_usuario_creador
    FROM Tarea
    WHERE id = $1`,
    [taskId]
  );
  return result.rows[0];
}

// Actualizar una tarea
export const updateTask = async (taskId, { titulo, descripcion, comentario }) => {
  const result = await pool.query(
    `UPDATE Tarea
    SET titulo = COALESCE($1, titulo),
      descripcion = COALESCE($2, descripcion),
      comentario = COALESCE($3, comentario)
    WHERE id = $4
    RETURNING id, titulo, descripcion, comentario, columna, id_area_trabajo, id_usuario_creador`,
    [titulo, descripcion, comentario, taskId]
  );
  return result.rows[0];
}

// Mover una tarea entre columnas
export const moveTask = async (taskId, newColumn) => {
  const result = await pool.query(
    `UPDATE Tarea
    SET columna = $1
    WHERE id = $2
    RETURNING id, titulo, descripcion, comentario, columna, id_area_trabajo, id_usuario_creador`,
    [newColumn, taskId]
  );
  return result.rows[0];
}

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  const result = await pool.query(
    `DELETE FROM Tarea WHERE id = $1
    RETURNING id`,
    [taskId]
  );
  return result.rowCount > 0;
};
