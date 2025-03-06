import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Question } from './question.entity';

@Entity({ name: 'question_reports', comment: 'Report to questions' })
export class QuestionReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number; // FK

  @Column('int')
  questionId: number; // FK

  // relations
  @ManyToOne(() => User, (user) => user.questionReports, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Question, (question) => question.reports, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  question: Question;
}
