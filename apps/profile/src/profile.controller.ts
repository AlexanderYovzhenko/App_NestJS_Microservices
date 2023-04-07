import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CheckUserDto } from './dto/check-user.dto';
import { AuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Endpoints')
@ApiBearerAuth()
@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Проверить сервер' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  getCheckServer(): string {
    return this.profileService.getCheckServer();
  }

  @ApiOperation({ summary: 'Получить токен' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('login')
  checkAuthUser(@Body() checkUser: CheckUserDto) {
    return this.profileService.checkAuthUser(checkUser);
  }

  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @Post('registration')
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile(createProfileDto);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  @Get('profile')
  getAll() {
    return this.profileService.getAll();
  }

  @ApiOperation({ summary: 'Получить пользователя' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(AuthGuard)
  @Get('profile/:id')
  getOne(@Param('id') id: string) {
    return this.profileService.getOne(+id);
  }

  @ApiOperation({ summary: 'Обновить профиль' })
  @ApiResponse({ status: HttpStatus.CREATED })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Put('profile/:id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @ApiOperation({ summary: 'Удалить профиль' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('profile/:id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
