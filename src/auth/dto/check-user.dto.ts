import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckUserDto {
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
}
