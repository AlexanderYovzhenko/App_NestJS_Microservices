import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    SequelizeModule.forFeature([User]),
    // registration JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
