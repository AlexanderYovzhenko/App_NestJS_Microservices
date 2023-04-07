import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('check_auth')
  async checkAuthUser(checkUser: CheckUserDto) {
    return this.authService.checkAuthUser(checkUser);
  }

  @MessagePattern('create_user')
  async createUser(user: { email: string; password: string }) {
    return this.authService.createUser(user.email, user.password);
  }

  @MessagePattern('get_all_users')
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @MessagePattern('get_one_user')
  async getOneUser(id: number) {
    return this.authService.getOneUser(id);
  }

  @MessagePattern('get_user_email')
  async getUserEmail(email: string) {
    return this.authService.getUserEmail(email);
  }

  @MessagePattern('update_user')
  async updateUser(user: { email: string; password: string; id: number }) {
    return this.authService.updateUser(user.email, user.password, user.id);
  }

  @EventPattern('remove_user')
  async removeUser(@Payload() id: Record<string, number>) {
    return this.authService.removeUser(id.data);
  }
}
