import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import { Book } from '../books/entities/book.entity';
import { Word } from '../words/entities/word.entity';

interface RawWord {
  id: number;
  word: string;
  wordTranslate: string;
  image?: string;
  audio?: string;
  audioMeaning?: string;
  audioExample?: string;
  textMeaning?: string;
  textExample?: string;
  transcription?: string;
  textMeaningTranslate?: string;
  textExampleTranslate?: string;
}

const BOOK_NAMES: Record<number, string> = {
  1: 'Учебник 1',
  2: 'Учебник 2',
  3: 'Учебник 3',
  4: 'Учебник 4',
  5: 'Учебник 5',
  6: 'Учебник 6',
};

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {}

  async runIfEmpty(): Promise<{
    seeded: boolean;
    books?: number;
    words?: number;
  }> {
    const count = await this.wordRepository.count();
    if (count > 0) {
      return { seeded: false };
    }
    const result = await this.run();
    return { seeded: true, books: result.books, words: result.words };
  }

  async run(): Promise<{ books: number; words: number }> {
    return this.wordRepository.manager.transaction(async (em) => {
      await em.query('DELETE FROM words');
      await em.query('DELETE FROM books');

      for (let bookNum = 1; bookNum <= 6; bookNum++) {
        await em.save(Book, {
          id: bookNum,
          name: BOOK_NAMES[bookNum],
        });
      }

      let totalWords = 0;
      const dataPath = path.resolve(__dirname, '../../data');

      for (let bookNum = 1; bookNum <= 6; bookNum++) {
        const module = await import(path.join(dataPath, `book${bookNum}.js`));
        const rawList: RawWord[] = module.default ?? [];

        const words = rawList.map((raw) =>
          em.create(Word, {
            word: raw.word,
            wordTranslate: raw.wordTranslate,
            bookId: bookNum,
            image: raw.image ?? null,
            audio: raw.audio ?? null,
            audioMeaning: raw.audioMeaning ?? null,
            audioExample: raw.audioExample ?? null,
            textMeaning: raw.textMeaning ?? null,
            textExample: raw.textExample ?? null,
            transcription: raw.transcription ?? null,
            textMeaningTranslate: raw.textMeaningTranslate ?? null,
            textExampleTranslate: raw.textExampleTranslate ?? null,
          }),
        );

        if (words.length > 0) {
          await em.save(Word, words);
          totalWords += words.length;
        }
      }

      return { books: 6, words: totalWords };
    });
  }
}
