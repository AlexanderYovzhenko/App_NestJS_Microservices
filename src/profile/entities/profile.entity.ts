import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';

interface ProfileCreationAttrs {
  firstName: string;
  lastName: string;
  phone: number;
  city: string;
  user_id: number;
}

@Table({ tableName: 'profile' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  readonly profile_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.BIGINT, unique: true, allowNull: false })
  phone: number;

  @Column({ type: DataType.STRING, allowNull: false })
  city: string;

  @Column({ type: DataType.INTEGER, unique: true, allowNull: false })
  @ForeignKey(() => User)
  user_id: number;

  @BelongsTo(() => User)
  user: User;
}
