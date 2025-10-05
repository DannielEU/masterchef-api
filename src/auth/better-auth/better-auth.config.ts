import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno manualmente desde la raíz del proyecto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Obtener la URI de MongoDB desde las variables de entorno
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('MONGO_URI no está definida en las variables de entorno. Asegúrate de tener un archivo .env con MONGO_URI configurado.');
}

// Crear conexión a MongoDB
const client = new MongoClient(mongoUri);
const db = client.db();

// Configurar transporte de email
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER, // tu email
    pass: process.env.SMTP_PASS, // tu contraseña de aplicación
  },
});

export const auth = betterAuth({
  // Base de datos - mongodbAdapter necesita una instancia Db, no una URI
  database: mongodbAdapter(db),

  // Configuración de email/password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // ✅ AHORA ACTIVADO
    sendResetPassword: async ({ user, url }) => {
      // Función para enviar email de reset de contraseña
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM || '"MasterChef API" <noreply@masterchef.com>',
        to: user.email,
        subject: 'Recupera tu contraseña - MasterChef',
        html: `
          <h2>Recuperación de contraseña</h2>
          <p>Hola ${user.name || user.email},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${url}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Restablecer contraseña
          </a>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, ignora este email.</p>
        `,
      });
    },
    sendVerificationEmail: async ({ user, url }) => {
      // Función para enviar email de verificación
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM || '"MasterChef API" <noreply@masterchef.com>',
        to: user.email,
        subject: 'Verifica tu email - MasterChef',
        html: `
          <h2>¡Bienvenido a MasterChef!</h2>
          <p>Hola ${user.name || user.email},</p>
          <p>Gracias por registrarte. Por favor verifica tu email haciendo clic en el siguiente enlace:</p>
          <a href="${url}" style="padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
            Verificar Email
          </a>
          <p>Este enlace expirará en 24 horas.</p>
        `,
      });
    },
  },

  // URL base de tu aplicación
  baseURL: process.env.BASE_URL || "http://localhost:3001",

  // Secret para firmar tokens (¡MUY IMPORTANTE!)
  secret: process.env.AUTH_SECRET || 'fallback-secret-dev-only',
});