import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from 'questions/entities/question.entity';
import { User } from 'users/entities/user.entity';

@Entity({ name: 'options', comment: 'Option' })
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @Column('varchar', { length: 100, nullable: true })
  context: string;

  @ManyToMany(() => User, (user) => user.id)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;
}
