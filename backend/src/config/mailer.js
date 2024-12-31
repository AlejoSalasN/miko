import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Correo de Gmail
    pass: process.env.EMAIL_PASSWORD, // Contraseña de aplicación
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Miko App" <${process.env.EMAIL_USER}>`,
      to, // Destinatario
      subject, // Asunto
      html, // Contenido en HTML
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}`);
    return result;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo');
  }
};
