import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { User } from 'auth/user.decorator';
import { AccessTokenPayload } from 'auth/types';
import { ChooseOptionDto } from './dto/create-user-option.dto';
import { UserOptionsService } from './user-options.service';

@ApiTags('User Option')
@Controller({ path: 'user-options' })
export class UserOptionsController {
  constructor(private userOptionsService: UserOptionsService) {}

  @ApiOperation({ summary: 'Choose Option' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async chooseOption(
    @User() user: AccessTokenPayload,
    @Body() dto: ChooseOptionDto,
  ) {
    return await this.userOptionsService.create(user.id, dto);
  }
}
