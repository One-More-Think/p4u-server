import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.decorator';
import { AccessTokenPayload } from './types';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Get Me',
    description: 'Get my information by using the access token.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@User() user: AccessTokenPayload) {
    return await this.authService.getMe(user.id);
  }
}
