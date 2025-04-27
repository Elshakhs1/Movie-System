import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/User.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    
    // Update fields if provided
    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.age !== undefined) user.age = updateUserDto.age;
    if (updateUserDto.gender) user.gender = updateUserDto.gender;
    if (updateUserDto.country) user.country = updateUserDto.country;
    
    user.updatedAt = new Date();
    
    return await user.save();
  }

  async promoteToAdmin(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.role = 'admin';
    user.updatedAt = new Date();
    return await user.save();
  }
} 