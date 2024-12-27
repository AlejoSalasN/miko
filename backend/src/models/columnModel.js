import pool from '../config/database.js';

// Crear una columna
export const createColumn = async (nombre, orden, workspaceId) => {
  const result = await pool.query(
    'INSERT INTO columna (nombre, orden, id_area_trabajo) VALUES ($1, $2, $3) RETURNING id, nombre, orden, id_area_trabajo',
    [nombre, orden, workspaceId]
  );
  return result.rows[0];
};

// Obtener columnas por área de trabajo
export const getColumnsByWorkspace = async (workspaceId) => {
  const result = await pool.query(`
    SELECT id, nombre, orden
    FROM Columna 
    WHERE id_area_trabajo = $1 
    ORDER BY orden`,
    [workspaceId]);
  return result.rows;
};

// Actualizar columna
export const updateColumn = async (columnId, { nombre, orden }) => {
  const result = await pool.query(
    `UPDATE Columna
    SET nombre = COALESCE($1, nombre), orden = COALESCE($2, orden)
    WHERE id = $3
    RETURNING id, nombre, orden, id_area_trabajo`,
    [nombre, orden, columnId]
  );
  return result.rows[0];
}

// Eliminar una columna
export const deleteColumn = async (columnId) => {
  const result = await pool.query(`
    DELETE FROM Columna
    WHERE id = $1
    RETURNING id`,
    [columnId]
  );
  return result.rowCount > 0;
};
