import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeedsService } from './seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('English App API')
    .setDescription('API для приложения по изучению английских слов')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const seeds = app.get(SeedsService);
  const result = await seeds.runIfEmpty();
  if (result.seeded) {
    console.log('Seed done:', result.words, 'words');
  }
  await app.listen(3000);
}
bootstrap();
