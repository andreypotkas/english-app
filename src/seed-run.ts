import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedsService } from './seeds/seeds.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeds = app.get(SeedsService);
  const result = await seeds.run();
  console.log('Seed done:', result);
  await app.close();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
