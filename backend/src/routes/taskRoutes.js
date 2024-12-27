import {
  createTaskController,
  getTasksByWorkspaceController,
  getTaskController,
  updateTaskController,
  moveTaskController,
  deleteTaskController,
} from '../controllers/taskController.js';

export default async function (fastify) {
  fastify.post(
    '/:workspaceId/:columnId/crear',
    { preHandler: [fastify.authenticate] },
    createTaskController
  );
  fastify.get(
    '/:workspaceId/tasks',
    { preHandler: [fastify.authenticate] },
    getTasksByWorkspaceController
  );
  fastify.get(
    '/:workspaceId/tasks/:id',
    { preHandler: [fastify.authenticate] },
    getTaskController
  );
  fastify.put(
    '/:workspaceId/tasks/:id',
    { preHandler: [fastify.authenticate] },
    updateTaskController
  );
  fastify.patch(
    '/:workspaceId/tasks/:id',
    { preHandler: [fastify.authenticate] },
    moveTaskController
  );
  fastify.delete(
    '/:workspaceId/tasks/:id',
    { preHandler: [fastify.authenticate] },
    deleteTaskController
  );
}
