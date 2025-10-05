import { Injectable, ConflictException, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import nodemailer from 'nodemailer';
import { Usuario } from './entities/auth.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  private emailTransporter: nodemailer.Transporter;

  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
    @Inject('BETTER_AUTH') private betterAuth: any,
  ) {
    // Configurar transporte de email
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async register(registerDto: RegisterDto) {
    const { email, password, nombre, rol, temporada } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    try {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generar token de verificación
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      // Crear nuevo usuario
      const newUser = new this.usuarioModel({
        email,
        password: hashedPassword,
        nombre,
        rol,
        temporada,
        emailVerified: false,
        verificationToken,
        verificationTokenExpires,
      });

      await newUser.save();

      // Enviar email de verificación
      const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;

      try {
        await this.emailTransporter.sendMail({
          from: process.env.SMTP_FROM || '"MasterChef API" <noreply@masterchef.com>',
          to: email,
          subject: 'Verifica tu email - MasterChef',
          html: `
            <h2>¡Bienvenido a MasterChef!</h2>
            <p>Hola ${nombre},</p>
            <p>Gracias por registrarte. Por favor verifica tu email haciendo clic en el siguiente enlace:</p>
            <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
              Verificar Email
            </a>
            <p>Este enlace expirará en 24 horas.</p>
            <p>Token: ${verificationToken}</p>
          `,
        });
        console.log(`Email de verificación enviado a ${email}`);
      } catch (emailError) {
        console.error('Error al enviar email:', emailError);
        // No fallar el registro si el email falla
      }

      // Retornar usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = newUser.toObject();
      return {
        message: 'Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.',
        user: userWithoutPassword,
        verificationToken, // SOLO PARA TESTING - quitar en producción
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw new ConflictException('Error al registrar usuario');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.usuarioModel.findOne({ email }).populate('temporada');
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user.toObject();
    return {
      message: 'Login exitoso',
      user: userWithoutPassword,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    try {
      // BetterAuth enviará automáticamente el email con el link de reset
      await this.betterAuth.api.forgetPassword({
        body: {
          email,
          redirectTo: `${process.env.BASE_URL}/auth/reset-password`, // URL a donde redirigir después del reset
        },
      });

      return {
        message: 'Si el email existe, recibirás un link para restablecer tu contraseña',
      };
    } catch (error) {
      // No revelamos si el email existe o no por seguridad
      return {
        message: 'Si el email existe, recibirás un link para restablecer tu contraseña',
      };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    try {
      await this.betterAuth.api.resetPassword({
        body: {
          token,
          password,
        },
      });

      return {
        message: 'Contraseña actualizada exitosamente',
      };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    // Buscar usuario por token de verificación
    const user = await this.usuarioModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }, // Token no expirado
    });

    if (!user) {
      throw new BadRequestException('Token de verificación inválido o expirado');
    }

    // Marcar email como verificado
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return {
      message: '✅ Email verificado exitosamente. Ya puedes iniciar sesión.',
      user: {
        email: user.email,
        nombre: user.nombre,
        emailVerified: true,
      },
    };
  }

  async resendVerificationEmail(email: string) {
    try {
      await this.betterAuth.api.sendVerificationEmail({
        body: {
          email,
        },
      });

      return {
        message: 'Email de verificación enviado',
      };
    } catch (error) {
      throw new BadRequestException('No se pudo enviar el email de verificación');
    }
  }
}
