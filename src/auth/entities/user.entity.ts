import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Profile } from '../../profile/entities/profile.entity';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'user', timestamps: false })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  user_id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasOne(() => Profile, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  profile: Profile;
}
