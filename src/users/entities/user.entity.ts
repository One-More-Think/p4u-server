import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users', comment: '유저' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: true }) // mvp: no unique
  snsId?: string;

  @Column({ length: 30, nullable: true })
  snsType: string;

  @Column({ length: 300, nullable: true }) // mvp: no unique
  email: string;

  @Column({ length: 30, nullable: true })
  country?: string;

  @Column({ length: 30, nullable: true })
  language?: string;

  @Column({ length: 30, nullable: true })
  gender?: string;

  @Column('smallint', { nullable: true })
  age?: number;

  @Column({ length: 100, nullable: true })
  occupation?: string;

  @Column({ length: 300, nullable: true, comment: '자기소개' })
  aboutMe?: string;

  @Column('boolean', { default: false })
  isBanned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // relations

  // written quiestions
  // questions

  // commented questions > x
  // comments
}
