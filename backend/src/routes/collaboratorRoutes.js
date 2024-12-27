import {
    addCollaboratorController,
    updateCollaboratorRoleController,
    deleteCollaboratorController,
  } from '../controllers/collaboratorController.js';
  
  export default async function (fastify) {
    fastify.post('/:id/collaborators', { preHandler: [fastify.authenticate] }, addCollaboratorController);
    fastify.patch(
      '/:id/collaborators/:collaboratorId',
      { preHandler: [fastify.authenticate] },
      updateCollaboratorRoleController
    );
    fastify.delete('/:id/collaborators', {preHandler: [fastify.authenticate] }, deleteCollaboratorController);
  }
  