import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

 app.enableCors({
  origin: [
    'http://localhost:3001', 
    'http://localhost:19006',
    'https://abdulrahmanek18-lab.github.io', // Keep this just in case
    'https://abdulrahmanek18-lab.github.io/mak-infratech-fsm-frontend/', // ADD YOUR EXACT GITHUB PAGES URL HERE
    'https://abdulrahmanek18-lab.github.io/ekfsm-backend/',
    // Also add your live backend URL if you have one
  ],
  credentials: true,
});

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('ekFSM API')
    .setDescription('Facilities Management ERP')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
