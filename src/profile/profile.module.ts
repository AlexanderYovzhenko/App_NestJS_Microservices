import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([Profile])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
