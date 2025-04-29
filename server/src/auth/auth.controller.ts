import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      status: 'success',
      message: 'User registered',
      data: { _id: user._id },
    };
  }

  @Post('register-admin')
  async registerAdmin(@Body() registerDto: RegisterDto) {
    const user = await this.authService.registerAdmin(registerDto);
    return {
      status: 'success',
      message: 'Admin user registered',
      data: { _id: user._id },
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      status: 'success',
      data: {
        token: result.token,
        user: { 
          _id: result.user._id, 
          email: result.user.email,
          name: result.user.name,
          role: result.user.role 
        },
      },
    };
  }

  // Debug endpoint to check JWT authentication
  @Get('verify-token')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@CurrentUser() user) {
    // If this endpoint is reached, the JWT is valid and user is authenticated
    return {
      status: 'success',
      message: 'JWT is valid',
      data: { user }
    };
  }
} 