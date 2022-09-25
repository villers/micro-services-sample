import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, InsertResult, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findOne(query: FindOptionsWhere<User>): Promise<User> {
    return this.userRepository.findOneBy(query);
  }

  async createUser(user: any): Promise<InsertResult> {
    try {
      const userEntity = this.userRepository.create(user);
      return await this.userRepository.insert(userEntity);
    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }
}
