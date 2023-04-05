import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { AuthService } from 'src/auth/auth.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private profileRepository: Repository<Profile>,
    private authService: AuthService,
  ) {}

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
      throw new HttpException(
        'Password and password confirmation are not coincide',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPhone = await this.checkPhone(phone);

    if (isPhone) {
      throw new HttpException(
        'Phone number already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isEmail = await this.authService.checkUserEmail(email);

    if (isEmail) {
      throw new HttpException('E-mail already exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = await this.authService.createUser(email, password);

    const newProfile = await this.profileRepository.create({
      firstName,
      lastName,
      phone,
      city,
      user_id: newUser.user_id,
    });

    const profile = await this.authService.getOneUser(newProfile.user_id);

    return profile;
  }

  async getAll() {
    const profiles = await this.authService.getAllUsers();

    return profiles;
  }

  async getOne(id: number) {
    const profile = await this.authService.getOneUser(id);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
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
      throw new HttpException(
        'Password and password confirmation are not coincide',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPhone = await this.checkPhone(phone);

    if (isPhone) {
      throw new HttpException(
        'Phone number already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isEmail = await this.authService.checkUserEmail(email);

    if (isEmail) {
      throw new HttpException('E-mail already exists', HttpStatus.BAD_REQUEST);
    }

    await this.authService.updateUser(email, password, id);

    await this.profileRepository.update(
      { firstName, lastName, phone, city },
      { where: { user_id: id } },
    );

    const updateProfile = await this.authService.getOneUser(id);

    return updateProfile;
  }

  async remove(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { user_id: id },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const removeUser = await this.authService.removeUser(id);

    if (removeUser) {
      return;
    }
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
