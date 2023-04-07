import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Почта' })
  @IsNotEmpty()
  @IsString({ message: 'email: должен быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({ example: '12345', description: 'Пароль' })
  @IsNotEmpty()
  @IsString({ message: 'password: должен быть строкой' })
  @Length(4, 16, { message: 'Не меньше 4 и не больше 16' })
  readonly password: string;

  @ApiProperty({ example: '12345', description: 'Подтверждение пароля' })
  @ValidateIf((o) => o.httpMethod === 'POST')
  @IsNotEmpty()
  @IsString({ message: 'confirmPassword: должен быть строкой' })
  readonly confirmPassword: string;

  @ApiProperty({ example: 'Александр', description: 'Имя' })
  @IsNotEmpty()
  @IsString({ message: 'firstName: должен быть строкой' })
  readonly firstName: string;

  @ApiProperty({ example: 'Александров', description: 'Фамилия' })
  @IsNotEmpty()
  @IsString({ message: 'lastName: должен быть строкой' })
  readonly lastName: string;

  @ApiProperty({ example: '375259339393', description: 'Номер телефона' })
  @IsNotEmpty()
  @IsNumber({}, { message: 'phone: должен быть номером' })
  readonly phone: number;

  @ApiProperty({ example: 'Минск', description: 'Город' })
  @IsNotEmpty()
  @IsString({ message: 'city: должен быть строкой' })
  readonly city: string;
}
