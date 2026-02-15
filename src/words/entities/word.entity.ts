import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity('words')
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  word: string;

  @Column({ name: 'word_translate' })
  wordTranslate: string;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book, (book) => book.words, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  audio: string;

  @Column({ name: 'audio_meaning', nullable: true })
  audioMeaning: string;

  @Column({ name: 'audio_example', nullable: true })
  audioExample: string;

  @Column({ name: 'text_meaning', type: 'text', nullable: true })
  textMeaning: string;

  @Column({ name: 'text_example', type: 'text', nullable: true })
  textExample: string;

  @Column({ nullable: true })
  transcription: string;

  @Column({ name: 'text_meaning_translate', type: 'text', nullable: true })
  textMeaningTranslate: string;

  @Column({ name: 'text_example_translate', type: 'text', nullable: true })
  textExampleTranslate: string;
}
