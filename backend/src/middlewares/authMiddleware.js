export const authenticate = async function (req, reply) {
    try {
        await req.jwtVerify();
    } catch (err) {
        reply.status(401).send({ error: 'Token inválido o expirado' });
    }
};

export const authenticateResetToken = async (req, reply) => {
    try {
      await req.jwtVerify(); // Verifica el token automáticamente usando Fastify JWT
      // El email está disponible en req.user después de la verificación
    } catch (err) {
      console.error('Error al autenticar token temporal:', err);
      return reply.status(401).send({ error: 'Token inválido o expirado' });
    }
  };
  

// export const checkRole = (requieredRole) => {
//     return async (req, reply) => {
//         try {
//             const { role } = req.user;

//             if (role == requieredRole || role === 'editor') {
//                 return;
//             }

//             reply.status(403).send({ error: 'No tienes permisos para realizar esta acción' });
//         } catch (err) {
//             reply.status(500).send({ error: 'Error al validar roles '});
//         }
//     }
// };