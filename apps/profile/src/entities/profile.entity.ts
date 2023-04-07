import { Column, DataType, Model, Table } from 'sequelize-typescript';

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

  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id: number;
}
