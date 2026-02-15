import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedsService } from './seeds/seeds.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeds = app.get(SeedsService);
  const result = await seeds.runIfEmpty();
  if (result.seeded) {
    console.log('Seed done:', result.words, 'words');
  }
  await app.listen(3000);
}
bootstrap();
