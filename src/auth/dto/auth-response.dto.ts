import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT токен' })
  access_token: string;

  @ApiProperty({ type: () => AuthResponseUserDto })
  user: AuthResponseUserDto;
}
