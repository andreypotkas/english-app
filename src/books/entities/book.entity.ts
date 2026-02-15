import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Word } from '../../words/entities/word.entity';

@Entity('books')
export class Book {
  @PrimaryColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Word, (word) => word.book)
  words: Word[];
}
