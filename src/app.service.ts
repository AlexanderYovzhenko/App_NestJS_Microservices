import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getCheckServer(): string {
    return 'Server is running!';
  }
}
