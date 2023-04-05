import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Home Page')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Проверить сервер' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  getCheckServer(): string {
    return this.appService.getCheckServer();
  }
}
