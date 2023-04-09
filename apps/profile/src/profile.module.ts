import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './entities/profile.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exception-filters/all-exceptions.filter';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./apps/profile/.env'],
    }),
    SequelizeModule.forFeature([Profile]),
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
        models: [Profile],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
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
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'AUTH_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [`${await configService.get('RABBITMQ_URL_DOCKER')}`],
            queue: 'auth_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class ProfileModule {}
