import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Update profile - authenticated
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @CurrentUser() user,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(user.userId, updateUserDto);
    return {
      status: 'success',
      data: updatedUser,
    };
  }

  // Promote user to admin - admin only
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/promote')
  async promoteUser(@Param('id') id: string) {
    const updatedUser = await this.usersService.promoteToAdmin(id);
    return {
      status: 'success',
      data: updatedUser,
    };
  }
} 