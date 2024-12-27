import { registerUser, loginUser, updateUserController, deleteUserController } from '../controllers/userController.js';

export default async function (fastify) {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
  fastify.put('/user', { preHandler: [fastify.authenticate] }, updateUserController);
  fastify.delete('/user', { preHandler: [fastify.authenticate] }, deleteUserController);
}
