import Fastify from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import { appConfig } from './src/config/appConfig.js';
import { registerRoutes } from './src/routes/index.js';
import { globalErrorHandler } from './src/middlewares/erroHandler.js';
import { authenticate } from './src/middlewares/authMiddleware.js';

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, { origin: appConfig.clienteUrl })

fastify.register(fastifyJwt, { secret: appConfig.jwtSecret });


fastify.decorate('authenticate', authenticate);

//fastify.decorate('checkRole', checkRole);

fastify.setErrorHandler(globalErrorHandler);

registerRoutes(fastify);

const start = async () => {
  try {
    await fastify.listen({ port: appConfig.port || 5000 });
    console.log(`Servidor corriendo en el puerto ${appConfig.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
