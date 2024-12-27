export const globalErrorHandler = (error, req, reply) => {
    console.error(error);
    reply.status(error.statusCode || 500).send({
        error: error.message || 'Ocurrió un error interno en el servidor',
    });
};