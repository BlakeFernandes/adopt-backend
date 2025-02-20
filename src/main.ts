import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';
  app.enableCors({
    origin: isProduction ? [] : ['http://localhost:3001'],
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
