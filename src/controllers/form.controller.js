import nodemailer from "nodemailer";
import Lead from "../models/lead.model.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "arcentralog@gmail.com",
    pass: "dqxs ytix kdmi cleg",
  },
});

export const sendMail = async (req, res) => {
  const { nombre, email, telefono, descripcion } = req.body;

  const mailOptions = {
    from: "arcentralog@gmail.com",
    to: "arcentralog@gmail.com",
    subject: `Nuevo lead: ${nombre}`,
    html: `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      h2 {
        color: #111;
        margin-bottom: 20px;
      }
      p {
        margin: 8px 0;
        color: #333;
      }
      .label {
        font-weight: bold;
        color: #000;
      }
      .box {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 6px;
        margin-top: 15px;
      }
      .footer {
        margin-top: 25px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
      .cta {
        margin-top: 20px;
        display: inline-block;
        background: #cfcfcf;
        color: #fff;
        padding: 10px 15px;
        text-decoration: none;
        border-radius: 5px;
      }
      .cta:hover {
        background: #333;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>🚛 Nueva solicitud de transporte</h2>

      <div class="box">
        <p><span class="label">Nombre:</span> ${nombre}</p>
        <p><span class="label">Email:</span> ${email}</p>
        <p><span class="label">Teléfono:</span> ${telefono || "No proporcionado"}</p>
      </div>

      <div class="box">
        <p class="label">Detalles del servicio:</p>
        <p>${descripcion || "Sin detalles"}</p>
      </div>

      <a href="mailto:${email}" class="cta">Responder cliente</a>

      <div class="footer">
        <p>Este mensaje fue enviado desde el formulario web de Arcentra</p>
      </div>
    </div>
  </body>
</html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await Lead.create({ nombre, email, telefono, descripcion });  
    res.status(200).json({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({ error: error.message });
  }
};
