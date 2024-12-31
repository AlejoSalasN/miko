import bcrypt from 'bcryptjs';
import { 
  getUserByEmail, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserById ,
  saveRecoveryCode,
  getRecoveryCode,
  deleteRecoveryCode,
  updateUserPassword,
  saveVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
} from '../models/userModel.js';
import { sendMail } from '../config/mailer.js';

// Generar un código aleatorio de 6 dígitos
const generateRecoveryCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
};

// Solicitar código de verificación
export const requestVerificationCode = async (req, reply) => {
  const { email } = req.body;
  if (!email) {
    return reply.status(400).send({ error: 'El correo es obligatorio' });
  }

  try {
    const code = generateRecoveryCode();
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar el código en la base de datos
    await saveVerificationCode(email, code, expiration);

    // Enviar el código al correo
    const subject = 'Verificación de Correo Electrónico';
    const html = `<p>Tu código de verificación es: <strong>${code}</strong></p>`;

    await sendMail(email, subject, html);

    reply.status(200).send({
      success: true,
      message: 'Código de verificación enviado al correo proporcionado',
    });
  } catch (err) {
    console.error('Error al enviar código de verificación:', err);
    reply.status(500).send({ error: 'Error interno del servidor' });
  }
};

// Validar código y completar registro
export const registerUser = async (req, reply) => {
  const { nombre, email, password, code } = req.body;
  if (!nombre || !email || !password || !code) {
    return reply.status(400).send({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar el código
    const verification = await getVerificationCode(email, code);
    if (!verification) {
      return reply.status(400).send({ error: 'Código inválido o expirado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await createUser(nombre, email, hashedPassword);

    // Eliminar el código de verificación
    await deleteVerificationCode(email);

    reply.status(201).send({ success: true, message: 'Usuario creado con éxito', data: newUser });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    reply.status(500).send({ error: 'Error interno del servidor' });
  }
};


// Inicio de sesión
export const loginUser = async (req, reply) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return reply.status(400).send({ success: false, error: 'Email y contraseña son requeridos' });
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return reply.status(404).send({ success: false, error: 'Usuario no encontrado' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(401).send({ success: false, error: 'Contraseña incorrecta' });
    }
    
    // Generar el token JWT
    const token = await reply.jwtSign({ id: user.id, email: user.email });

    // Enviar token al cliente
    reply.send({ 
      message: 'Inicio de sesión exitoso', 
      token: token, 
      user: { id: user.id, email: user.email, nombre: user.nombre }
    });

  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    reply.status(500).send({ error: 'Error al iniciar sesión' });
  }
};

// Actualizar usuario
export const updateUserController = async (req, reply) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return reply.status(400).send({ success:false, error: 'Todos los campos son obligatorios' });
  }
  try {
    // Obtener el ID del usuario desde el token JWT (establecido en req.user)
    const { id } = req.user;
    if (!id) {
      return reply.status(401).send({ success: false, error: 'Usuario no autenticado' });
    }

    // Obtener el usuario actual desde la base de datos
    const user = await getUserById(id);
    if (!user) {
      return reply.status(404).send({ success: false, error: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña actual es correcta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(401).send({ success: false, error: 'Contraseña actual incorrecta' });
    }

    // Hashear la nueva contraseña si fue proporcionada
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar los datos del usuario
    const updatedUser = await updateUser(id, hashedPassword);

    // Enviar respuesta al cliente
    reply.send({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    });
  } catch (err) {
    // Manejar errores del servidor
    console.error('Error al actualizar usuario:', err);
    reply.status(500).send({ success: false, error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
export const deleteUserController = async (req, reply) => {
  const { password } = req.body;
  const { id } = req.user;
  try {
    const user = await getUserByEmail(req.user.email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(401).send({ error: 'Contraseña incorrecta' });
    }
    await deleteUser(id);
    reply.status(200).send({ message: 'Usuario eliminado con éxito' });
  } catch (err) {
    reply.status(500).send({ error: 'Error al eliminar usuario' });
  }
};

// Solicitar código de recuperación
export const requestRecoveryCode = async (req, reply) => {
  const { email } = req.body;
  if (!email) {
    return reply.status(400).send({ error: 'El correo es obligatorio' });
  }

  try {
    const code = generateRecoveryCode();
    const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Guardar el código en la base de datos
    await saveRecoveryCode(email, code, expiration);

    // Enviar el código al correo
    const subject = 'Código de recuperación de contraseña';
    const html = `<p>Tu código de recuperación es: <strong>${code}</strong></p>`;

    await sendMail(email, subject, html);

    reply.status(200).send({
      success: true,
      message: 'Código de recuperación enviado al correo proporcionado',
    });
  } catch (err) {
    console.error('Error al solicitar código de recuperación:', err);
    reply.status(500).send({ error: 'Error interno del servidor' });
  }
};

// Validar código de recuperación
export const validateRecoveryCode = async (req, reply) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return reply.status(400).send({ error: 'El correo y el código son obligatorios' });
  }

  try {
    const recovery = await getRecoveryCode(email, code);

    if (!recovery) {
      return reply.status(400).send({ error: 'Código inválido o expirado' });
    }

    // Código válido, eliminarlo para evitar reutilización
    await deleteRecoveryCode(email);

    // Generar un token temporal (válido por 15 minutos)
    const tempToken = await reply.jwtSign({ email }, { expiresIn: '15m' });

    reply.status(200).send({
      success: true,
      message: 'Código validado. Puedes cambiar tu contraseña.',
      token: tempToken, // Enviar el token al cliente
    });
  } catch (err) {
    console.error('Error al validar código:', err);
    reply.status(500).send({ error: 'Error interno del servidor' });
  }
};

// Cambiar contraseña
export const resetPassword = async (req, reply) => {
  const { newPassword } = req.body;

  // El email viene del token autenticado
  const { email } = req.user;

  if (!newPassword) {
    return reply.status(400).send({ error: 'La nueva contraseña es obligatoria' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario
    await updateUserPassword(email, hashedPassword);

    reply.status(200).send({
      success: true,
      message: 'Contraseña cambiada exitosamente',
    });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    reply.status(500).send({ error: 'Error interno del servidor' });
  }
};

