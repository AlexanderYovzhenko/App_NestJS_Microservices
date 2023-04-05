import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('App_NestJS_Microservices')
  .setDescription('Api for registration')
  .setVersion('1.0.0')
  .addBearerAuth()
  .addTag('Server NestJS')
  .build();
