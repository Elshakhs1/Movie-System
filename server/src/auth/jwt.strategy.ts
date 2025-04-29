import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    
    const secret = configService.get<string>('JWT_SECRET');
    this.logger.log(`JWT Strategy initialized with secret key: ${secret?.substring(0, 3)}...`);
    
    if (!secret) {
      this.logger.error('WARNING: JWT_SECRET is not set or empty!');
    }
  }

  async validate(payload: any) {
    try {
      this.logger.log('JWT validation attempt...');
      this.logger.log('JWT payload being validated:', JSON.stringify(payload));
      
      if (!payload) {
        this.logger.error('JWT validation failed: Empty payload');
        throw new UnauthorizedException('Invalid token payload');
      }
      
      // Validate required fields
      if (!payload.sub && !payload.userId) {
        this.logger.error('JWT validation failed: Missing user identifier (sub or userId)');
        throw new UnauthorizedException('Invalid token: missing user identifier');
      }
      
      // Create a standardized user object
      const userObj = { 
        userId: payload.userId || payload.sub, // Support both formats
        email: payload.email, 
        role: payload.role || 'user' // Default to user role if not specified
      };
      
      this.logger.log('JWT validation successful - Returning user object:', JSON.stringify(userObj));
      return userObj;
    } catch (error) {
      this.logger.error(`JWT validation error: ${error.message}`, error.stack);
      throw error;
    }
  }
} 