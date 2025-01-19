import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Put,
  Param,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  SignInAdminDto,
  SignInAppleDto,
  SignInGoogleDto,
  UpdateUserDto,
} from './dto/user.dto';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { User } from 'auth/user.decorator';
import { AccessTokenPayload } from 'auth/types';

@ApiTags('User')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Admin Login' })
  @Post('sign-in/admin')
  async signInAdmin(@Body() dto: SignInAdminDto) {
    return await this.usersService.signInAdmin(dto);
  }

  @ApiOperation({ summary: 'Google Login' })
  @Post('sign-in/google')
  async signInGoogle(@Body() dto: SignInGoogleDto) {
    try {
      return await this.usersService.signInGoogle(dto);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Apple Login' })
  @Post('sign-in/apple')
  async signInApple(@Body() dto: SignInAppleDto) {
    try {
      return await this.usersService.signInApple(dto);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  @ApiOperation({ summary: 'User update' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @User() user: AccessTokenPayload,
    @Body() dto: UpdateUserDto,
  ) {
    if (user.id !== userId) {
      throw new ForbiddenException('Invalid user id');
    }
    await this.usersService.updateUser(user.id, dto);
  }

  @ApiOperation({ summary: 'User detail' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUserDetail(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getUserDetail(userId);
  }
}
