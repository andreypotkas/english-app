import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Book } from './books/entities/book.entity';
import { SeedsModule } from './seeds/seeds.module';
import { User } from './users/entities/user.entity';
import { Word } from './words/entities/word.entity';
import { WordsModule } from './words/words.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST'),
        port: parseInt(config.get('DATABASE_PORT'), 10),
        username: config.get('DATABASE_USER'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_DB'),
        entities: [User, Book, Word],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SeedsModule,
    WordsModule,
  ],
})
export class AppModule {}
