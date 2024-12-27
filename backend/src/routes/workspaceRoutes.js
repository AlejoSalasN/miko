import { createWorkspaceController, getWorkspacesController, deleteWorkspaceController, getWorkspaceByIdController, updateWorkspaceController, addCollaboratorController, deleteCollaboratorController } from '../controllers/workspaceController.js';
 
export default async function (fastify) {
  fastify.post('/create', { preHandler: [fastify.authenticate] }, createWorkspaceController);
  fastify.get('/', { preHandler: [fastify.authenticate] }, getWorkspacesController);
  fastify.get('/:id', { preHandler: [fastify.authenticate] }, getWorkspaceByIdController);
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, updateWorkspaceController);
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, deleteWorkspaceController);

  // fastify.post('/:id/collaborators', { preHandler: [fastify.authenticate] }, addCollaboratorController);
  // fastify.delete('/:id/collaborators', {preHandler: [fastify.authenticate] }, deleteCollaboratorController);
}
