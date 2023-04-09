import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/auth/.env'],
    }),
    SequelizeModule.forFeature([User]),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: await configService.get('DB_DIALECT'),
        host: await configService.get('POSTGRES_HOST'),
        port: await configService.get('POSTGRES_PORT'),
        username: await configService.get('POSTGRES_USER'),
        password: await configService.get('POSTGRES_PASSWORD'),
        database: await configService.get('POSTGRES_DB'),
        models: [User],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    // registration JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: await configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
