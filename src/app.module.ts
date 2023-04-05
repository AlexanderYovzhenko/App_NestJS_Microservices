import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AllExceptionsFilter } from './exception-filters/all-exceptions.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { User } from './auth/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import configurations from './configurations';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      envFilePath: ['.env'],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get('DB_DIALECT'),
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        models: [User, Profile],
        autoLoadModels: true,
        synchronize: true,
        sync: { force: true },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
    }),
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
