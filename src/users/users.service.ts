import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'entity/user.entity';
import { LoginDto, PostUserDto } from 'users/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneUser(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneBy({ id });
    } catch (err) {
      throw new Error('Failed to find user');
    }
  }

  async loginUser(sns: string, data: PostUserDto): Promise<LoginDto> {
    try {
      // WIP implement login user
      let res: LoginDto;
      return res;
    } catch (err) {
      throw new Error('Failed to create user');
    }
  }

  async removeUser(id: number): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (err) {
      throw new Error('Failed to delete user');
    }
  }
}
