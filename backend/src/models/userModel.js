import pool from '../config/database.js';

// Obtener Usuario por email
export const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT id, nombre, email, password FROM Usuario WHERE email = $1', [email]);
  return result.rows[0];
};

// Obtener id de usuario para colaboradores
export const getUserByEmailCollaborator = async (email) => {
  const result = await pool.query('SELECT id FROM Usuario WHERE email = $1', [email]);
  return result.rows[0];
}

// Obtener Usuario por id
export const getUserById = async (id) => {
  const result = await pool.query('SELECT id, nombre, email, password FROM Usuario WHERE id = $1', [id]);
  return result.rows[0];
};

// Guardar código de verificación de correo
export const saveVerificationCode = async (email, code, expiration) => {
  await pool.query(
    'INSERT INTO EmailVerificationCodes (email, code, expiration) VALUES ($1, $2, $3)',
    [email, code, expiration]
  );
};

// Obtener código de verificación
export const getVerificationCode = async (email, code) => {
  const result = await pool.query(
    'SELECT * FROM EmailVerificationCodes WHERE email = $1 AND code = $2 AND expiration > NOW()',
    [email, code]
  );
  return result.rows[0];
};

// Eliminar código de verificación
export const deleteVerificationCode = async (email) => {
  await pool.query('DELETE FROM EmailVerificationCodes WHERE email = $1', [email]);
};


// Crear Usuario
export const createUser = async (nombre, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO Usuario (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
    [nombre, email, hashedPassword]
  );
  return result.rows[0];
};

// Actualizar Usuario
export const updateUser = async (id, hashedPassword) => {
  const result = await pool.query(
    'UPDATE Usuario SET password = $1 WHERE id = $2 RETURNING id, nombre, email',
    [hashedPassword, id]
  );
  return result.rows[0];
};

// Eliminar Usuario
export const deleteUser = async (id) => {
  await pool.query('DELETE FROM Usuario WHERE id = $1', [id]);
};

// Guardar código de recuperación
export const saveRecoveryCode = async (email, code, expiration) => {
  await pool.query(
    'INSERT INTO PasswordResetCodes (email, code, expiration) VALUES ($1, $2, $3)',
    [email, code, expiration]
  );
};

// Obtener código de recuperación
export const getRecoveryCode = async (email, code) => {
  const result = await pool.query(
    'SELECT * FROM PasswordResetCodes WHERE email = $1 AND code = $2 AND expiration > NOW()',
    [email, code]
  );
  return result.rows[0];
};

// Eliminar código de recuperación
export const deleteRecoveryCode = async (email) => {
  await pool.query('DELETE FROM PasswordResetCodes WHERE email = $1', [email]);
};

// Actualizar contraseña del usuario
export const updateUserPassword = async (email, hashedPassword) => {
  await pool.query(
    'UPDATE Usuario SET password = $1 WHERE email = $2',
    [hashedPassword, email]
  );
};
