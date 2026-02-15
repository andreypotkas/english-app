import { Controller, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { PaginateValidate, PaginateValidateType } from '../helpers/pagination/decorators/paginate.decorator';
import { WordsService } from './words.service';
import { WordResponseDto } from './dto/word-response.dto';

@ApiTags('Слова')
@ApiExtraModels(WordResponseDto)
@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  @ApiOperation({ summary: 'Список слов', description: 'Получить слова по номеру книги с пагинацией' })
  @ApiQuery({ name: 'book', required: true, description: 'Номер книги (1–6)', example: '1' })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Записей на странице', example: 20 })
  @ApiOkResponse({
    description: 'Список слов с пагинацией',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(WordResponseDto) } },
        total: { type: 'number', example: 600 },
      },
    },
  })
  async findAll(
    @Query('book') book: string,
    @PaginateValidate() paginate: PaginateValidateType,
  ) {
    return this.wordsService.findAll(book, paginate);
  }
}
