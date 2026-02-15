import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResponseDto } from '../helpers/pagination/dto/pagination-response.dto';
import { PaginateValidateType } from '../helpers/pagination/decorators/paginate.decorator';
import { Word } from './entities/word.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {}

  async findAll(
    book: string = '1',
    query: PaginateValidateType,
  ): Promise<PaginatedResponseDto<Word>> {
    const bookNum = Number(book ?? '1');

    const [data, total] = await this.wordRepository.findAndCount({
      where: { bookId: bookNum },
      ...query,
    });

    return new PaginatedResponseDto(data, total);
  }
}
