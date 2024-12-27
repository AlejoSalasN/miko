import userRoutes from "./userRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import columnRoutes from "./columnRoutes.js";
import taskRoutes from "./taskRoutes.js";
import collaboratorRoutes from "./collaboratorRoutes.js";

export const registerRoutes = (fastify) => {
    fastify.register(userRoutes, { prefix: '/api/users' });
    fastify.register(workspaceRoutes, { prefix: '/api/workspaces' });
    fastify.register(columnRoutes, { prefix: '/api/workspaces' });
    fastify.register(taskRoutes, { prefix: '/api/workspaces' });
    fastify.register(collaboratorRoutes, { prefix: '/api/workspaces' });
};