import { 
  registerUser, 
  loginUser, 
  updateUserController, 
  deleteUserController,
  requestRecoveryCode,
  validateRecoveryCode,
  resetPassword,
  requestVerificationCode, 
} from '../controllers/userController.js';

export default async function (fastify) {
  fastify.post('/request-verification-code', requestVerificationCode);
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
  fastify.put('/user', { preHandler: [fastify.authenticate] }, updateUserController);
  fastify.delete('/user', { preHandler: [fastify.authenticate] }, deleteUserController);
  fastify.post('/request-recovery-code', requestRecoveryCode);
  fastify.post('/validate-recovery-code', validateRecoveryCode);
  fastify.post('/reset-password', { preHandler: [fastify.authenticateResetToken] }, resetPassword);
}
