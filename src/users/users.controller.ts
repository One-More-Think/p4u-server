import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { PostUserDto } from 'users/user.dto';
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('login/:sns')
  tokenUserLogin() {
    try {
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err?.message || 'Exceptional error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login/:sns')
  async create(
    @Res() res: Response,
    @Param('sns') sns: string,
    @Body() data: PostUserDto,
  ) {
    try {
      const result = await this.userService.loginUser(sns, data);
      return {
        statusCode: HttpStatus.OK,
        message: `user ${result?.sns_id} successfully login`,
        data: result,
      };
    } catch (err) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: err?.message || 'Exceptional error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
