import { Controller, Post, Body, HttpStatus, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from './dto/create-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en el sistema con email, contraseña, nombre, rol y temporada'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439022',
        email: 'usuario@example.com',
        nombre: 'Juan Pérez',
        rol: 'participante',
        temporada: '507f1f77bcf86cd799439011'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o email ya registrado'
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El usuario ya existe'
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario con email y contraseña, devuelve los datos del usuario'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439022',
        email: 'usuario@example.com',
        nombre: 'Juan Pérez',
        rol: 'participante',
        temporada: '507f1f77bcf86cd799439011'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos'
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un email con un link para restablecer la contraseña'
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email de recuperación enviado',
    schema: {
      example: {
        message: 'Si el email existe, recibirás un link para restablecer tu contraseña'
      }
    }
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablecer contraseña',
    description: 'Establece una nueva contraseña usando el token recibido por email'
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña actualizada exitosamente',
    schema: {
      example: {
        message: 'Contraseña actualizada exitosamente'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token inválido o expirado'
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('verify-email')
  @ApiOperation({
    summary: 'Verificar email (desde link del email)',
    description: 'Verifica el email del usuario usando el token recibido por email'
  })
  @ApiQuery({ name: 'token', type: String, description: 'Token de verificación' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verificado exitosamente',
    schema: {
      example: {
        message: 'Email verificado exitosamente'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token de verificación inválido o expirado'
  })
  verifyEmailGet(@Query('token') token: string) {
    return this.authService.verifyEmail({ token });
  }

  @Post('verify-email')
  @ApiOperation({
    summary: 'Verificar email (API)',
    description: 'Verifica el email del usuario usando el token recibido por email'
  })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verificado exitosamente',
    schema: {
      example: {
        message: 'Email verificado exitosamente'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token de verificación inválido o expirado'
  })
  verifyEmailPost(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  @ApiOperation({
    summary: 'Reenviar email de verificación',
    description: 'Reenvía el email de verificación al usuario'
  })
  @ApiQuery({ name: 'email', type: String, description: 'Email del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email de verificación reenviado',
    schema: {
      example: {
        message: 'Email de verificación enviado'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No se pudo enviar el email'
  })
  resendVerification(@Query('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }
}
