export const appConfig = {
    port: process.env.Port || 5000,
    jwtSecret: process.env.JWT_SECRET,
    clienteUrl: process.env.CLIENT_URL || '*',
};