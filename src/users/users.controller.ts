import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInGoogleDto } from './dto/user.dto';

@ApiTags('User')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Google Login' })
  @Post('sign-in/google')
  async signInGoogle(@Body() dto: SignInGoogleDto) {
    try {
      console.log(dto);
      return await this.usersService.signInGoogle(dto);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }
}
