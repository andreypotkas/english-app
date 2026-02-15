import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class WordsQueryDto {
  @ApiPropertyOptional({ description: 'Номер книги (1–6)', default: '1' })
  @IsOptional()
  @IsString()
  book?: string;

  @ApiPropertyOptional({ description: 'Номер страницы', default: '1' })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ description: 'Записей на странице', default: '20' })
  @IsOptional()
  @IsString()
  limit?: string;
}
