import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
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
    
    this.logger.log(`JWT Strategy initialized with secret key: ${configService.get<string>('JWT_SECRET')?.substring(0, 3)}...`);
  }

  async validate(payload: any) {
    this.logger.log('JWT payload being validated:', JSON.stringify(payload));
    
    // Create a standardized user object
    const userObj = { 
      userId: payload.userId || payload.sub, // Support both formats
      email: payload.email, 
      role: payload.role 
    };
    
    this.logger.log('Returning user object:', JSON.stringify(userObj));
    return userObj;
  }
} 