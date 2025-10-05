import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/auth.entity';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, nombre, rol, temporada } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new this.usuarioModel({
      email,
      password: hashedPassword,
      nombre,
      rol,
      temporada,
    });

    await newUser.save();

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return {
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
    };
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
}
