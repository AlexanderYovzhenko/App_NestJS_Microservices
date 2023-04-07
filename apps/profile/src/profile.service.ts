import { Inject, Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: Repository<Profile>,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  ) {
    this.authClient.connect();
  }

  getCheckServer(): string {
    return 'Server is running!';
  }

  async checkAuthUser(checkUser: { email: string; password: string }) {
    const token = await firstValueFrom(
      this.authClient.send('check_auth', checkUser),
    );

    if (!token) {
      throw new ForbiddenException('Wrong login/password combination');
    }

    return { token };
  }

  async createProfile(createProfileDto: CreateProfileDto) {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      city,
    } = createProfileDto;

    const isConfirmPassword = this.checkConfirmPassword(
      password,
      confirmPassword,
    );

    if (!isConfirmPassword) {
      throw new BadRequestException(
        'Password and password confirmation are not coincide',
      );
    }

    const isPhone = await this.checkPhone(phone);

    if (isPhone) {
      throw new BadRequestException('Phone number already exists');
    }

    const isEmail = await firstValueFrom(
      this.authClient.send('get_user_email', email),
    );

    if (isEmail) {
      throw new BadRequestException('E-mail already exists');
    }

    const newUser = await firstValueFrom(
      this.authClient.send('create_user', { email, password }),
    );

    const newProfile = await this.profileRepository.create({
      firstName,
      lastName,
      phone,
      city,
      user_id: newUser.user_id,
    });

    return { ...newUser, profile: newProfile };
  }

  async getAll() {
    const users = await firstValueFrom(
      this.authClient.send('get_all_users', ''),
    );

    const profiles = await this.profileRepository.findAll();

    const usersProfiles = users.map(
      (user: { user_id: number; email: string; password: string }) => {
        const indexProfile = profiles
          .map((profile) => profile.user_id)
          .indexOf(user.user_id);

        return {
          ...user,
          profile: profiles[indexProfile],
        };
      },
    );

    return usersProfiles;
  }

  async getOne(id: number) {
    const user = await firstValueFrom(this.authClient.send('get_one_user', id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findOne({
      where: {
        user_id: id,
      },
    });

    return { ...user, profile };
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      city,
    } = updateProfileDto;

    const isProfile = await this.profileRepository.findOne({
      where: { user_id: id },
    });

    if (!isProfile) {
      throw new NotFoundException('Profile not found');
    }

    const isConfirmPassword = this.checkConfirmPassword(
      password,
      confirmPassword,
    );

    if (confirmPassword && !isConfirmPassword) {
      throw new BadRequestException(
        'Password and password confirmation are not coincide',
      );
    }

    const isPhone = await this.checkPhone(phone);

    if (isPhone && isPhone.user_id !== id) {
      throw new BadRequestException('Phone number already exists');
    }

    const isEmail = await firstValueFrom(
      this.authClient.send('get_user_email', email),
    );

    if (isEmail && isEmail.user_id !== id) {
      throw new BadRequestException('E-mail already exists');
    }

    const checkUpdateUser = await firstValueFrom(
      this.authClient.send('update_user', { email, password, id }),
    );

    const checkUpdateProfile = await this.profileRepository.update(
      { firstName, lastName, phone, city },
      { where: { user_id: id } },
    );

    if (checkUpdateUser.length && checkUpdateProfile.length) {
      const updateProfile = await this.getOne(id);

      return updateProfile;
    }
  }

  async remove(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { user_id: id },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.profileRepository.destroy({
      where: {
        user_id: id,
      },
      force: true,
    });

    await firstValueFrom(this.authClient.emit('remove_user', { data: id }));
  }

  private checkConfirmPassword(
    password: string,
    confirmPassword: string | undefined,
  ) {
    return password === confirmPassword;
  }

  private async checkPhone(phone: number) {
    const isPhone = await this.profileRepository.findOne({
      where: { phone },
    });

    return isPhone;
  }
}
