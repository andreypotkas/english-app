import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация', description: 'Создать аккаунт по email и паролю' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Успешная регистрация', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Пользователь с таким email уже существует' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход', description: 'Получить JWT по email и паролю' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Успешный вход', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
