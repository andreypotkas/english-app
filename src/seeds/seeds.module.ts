import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/entities/book.entity';
import { Word } from '../words/entities/word.entity';
import { SeedsService } from './seeds.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Word]),
  ],
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}
