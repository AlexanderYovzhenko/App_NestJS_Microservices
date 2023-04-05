import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';

@ApiTags('Login')
@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Получить токен' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post()
  async checkAuthUser(@Body() checkUser: CheckUserDto) {
    const token = await this.authService.checkAuthUser(checkUser);

    return { token };
  }
}
