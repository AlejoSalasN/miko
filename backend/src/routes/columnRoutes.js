import {
  createColumnController,
  getColumnsController,
  updateColumnController,
  deleteColumnController,
} from '../controllers/columnController.js';

export default async function (fastify) {
  fastify.post(
    '/:workspaceId/columns/create',
    { preHandler: [fastify.authenticate] },
    createColumnController
  );
  fastify.get(
    '/:workspaceId/columns',
    { preHandler: [fastify.authenticate] },
    getColumnsController
  );
  fastify.put(
    '/:workspaceId/columns/:id',
    { preHandler: [fastify.authenticate] },
    updateColumnController
  );
  fastify.delete(
    '/:workspaceId/columns/:id',
    { preHandler: [fastify.authenticate] },
    deleteColumnController
  );
}

