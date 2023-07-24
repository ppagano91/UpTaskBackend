import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  // console.log(datos)
  const { nombre, email, token } = datos;

  // TODO: Mover a variables de entorno
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f278db65e96818",
      pass: "6437f9f23fb895",
    },
  });

  // Información del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "Confirma tu cuenta en UpTask",
    text: `Hola ${nombre}, confirma tu cuenta en UpTask`,
    html: `
        <h1>Confirma tu cuenta</h1>
        <p>Hola ${nombre}, confirma tu cuenta en UpTask</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
        <p>Si tu no creaste esta cuenta, ignora este mensaje</p>
        `,
  });
};

export const emailRecuperarPassword = async (datos) => {
  // console.log(datos)
  const { nombre, email, token } = datos;

  // TODO: Mover a variables de entorno
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f278db65e96818",
      pass: "6437f9f23fb895",
    },
  });

  // Información del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "Upstask - Reestablece tu Password",
    text: `Reestablece tu Password`,
    html: `
        <h1>Reestablece tu Password</h1>
        <p>Hola ${nombre}, has solicitado reestablecer tu password</p>
        <p>Da click en el siguiente enlace para generar un nuevo password: 
        <a href="${process.env.FRONTEND_URL}/recuperar-password/${token}">Reestablecer Password</a>
        </p>
        <p>Si tu no solicitaste este mail, ignora este mensaje</p>
        `,
  });
};
