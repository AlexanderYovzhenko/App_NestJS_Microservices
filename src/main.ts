import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { config } from './docs/doc-config';
import { ValidationPipe } from '@nestjs/common/pipes';
import { loggerWinston } from './utils/logger-winston.config';
import { LoggingInterceptor } from './utils/logger.middleware';
import { AllExceptionsFilter } from './exception-filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: loggerWinston,
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, '0.0.0.0', () => {
    console.info(`Server is running on port ${PORT}`);
  });
}

bootstrap();
