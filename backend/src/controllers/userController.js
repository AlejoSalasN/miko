import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser, updateUser, deleteUser, getUserById } from '../models/userModel.js';
//import { auditLog } from './auditController.js';

// Registro de usuario
export const registerUser = async (req, reply) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return reply.status(400).send({ success: false, error: 'Todos los campos son obligatorios' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(nombre, email, hashedPassword);

    // Registrar acción
    //await auditLog('USER_REGISTERED', newUser.id, null, `Usuario registrado: ${email}`);
    reply.status(201).send({success: true, message: 'Usuario creado con éxito', data: newUser});
  } catch (err) {
    reply.status(500).send({ success: false, error: `Error al registrar usuario ${err}` });
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
    console.log({user})
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
