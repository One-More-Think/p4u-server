import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Option } from 'questions/entities/option.entity';

@Entity({ name: 'user_options', comment: 'Selected options by users' })
export class UserOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number; // FK

  @Column('int')
  optionId: number; // FK

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @ManyToOne(() => User, (user) => user.selectedOptions, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE', // have to count when user is deleted?
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Option, (option) => option.selectedUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'optionId' })
  option: Option;
}
