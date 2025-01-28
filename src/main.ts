import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup overridden logger using winston
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  const config = new DocumentBuilder()
    .setTitle('Contact Manajement API')
    .setDescription('The Contact Manajement API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addServer('https://contact-management-api.coreboy.my.id/', 'Development environment')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.useLogger(logger);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://contact-management.coreboy.my.id',
    ],
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
    credentials: true, // Allow cookies or credentials if needed
  });
  
  await app.listen(3000);
}
bootstrap();
