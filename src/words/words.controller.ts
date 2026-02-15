import { Controller, Get, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { PaginateValidate, PaginateValidateType } from '../helpers/pagination/decorators/paginate.decorator';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  async findAll(
    @Query('book') book: string,
    @PaginateValidate() paginate: PaginateValidateType,
  ) {
    return this.wordsService.findAll(book, paginate);
  }
}
