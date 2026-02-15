import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WordResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'agree' })
  word: string;

  @ApiProperty({ example: 'согласна' })
  wordTranslate: string;

  @ApiProperty()
  bookId: number;

  @ApiPropertyOptional()
  image: string | null;

  @ApiPropertyOptional()
  audio: string | null;

  @ApiPropertyOptional()
  audioMeaning: string | null;

  @ApiPropertyOptional()
  audioExample: string | null;

  @ApiPropertyOptional()
  textMeaning: string | null;

  @ApiPropertyOptional()
  textExample: string | null;

  @ApiPropertyOptional()
  transcription: string | null;

  @ApiPropertyOptional()
  textMeaningTranslate: string | null;

  @ApiPropertyOptional()
  textExampleTranslate: string | null;
}
