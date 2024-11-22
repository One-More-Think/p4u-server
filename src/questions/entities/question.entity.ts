import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'questions', comment: '질문' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO
}
