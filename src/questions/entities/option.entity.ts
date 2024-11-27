import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { UserOption } from 'users/entities/user-option.entity';

@Entity({ name: 'options', comment: 'Option' })
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  questionId: number; // FK

  @Column('varchar', { length: 100 })
  context: string;

  @CreateDateColumn()
  createdAt: Date;

  // relations
  @ManyToOne(() => Question, (question) => question.options, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;

  @OneToMany(() => UserOption, (userOption) => userOption.option)
  selectedUsers: UserOption[];
}
