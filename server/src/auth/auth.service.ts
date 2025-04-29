import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/User.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, ...rest } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new this.userModel({
      email,
      passwordHash,
      role: 'user', // Default role
      createdAt: new Date(),
      updatedAt: new Date(),
      ...rest,
    });

    return await newUser.save();
  }

  async registerAdmin(registerDto: RegisterDto): Promise<User> {
    const { email, password, ...rest } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new admin user
    const newUser = new this.userModel({
      email,
      passwordHash,
      role: 'admin', // Admin role
      createdAt: new Date(),
      updatedAt: new Date(),
      ...rest,
    });

    return await newUser.save();
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Extract the user ID safely
    const userId = user._id ? user._id.toString() : '';
    
    // Generate JWT - make sure payload fields match what's used in CurrentUser decorator
    const payload = { 
      email: user.email, 
      sub: userId, // Using the safely extracted ID
      userId: userId, // Using the safely extracted ID
      role: user.role 
    };
    
    console.log('Creating JWT with payload:', JSON.stringify(payload));
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name || '',
        role: user.role
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }
} 