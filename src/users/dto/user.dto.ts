import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class SignInDto {
  /**
   * Third-party sub id
   */
  @ApiProperty({ name: 'idToken', description: 'Third-party sub id' })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

/**
 * Admin Sign In DTO
 */
export class SignInAdminDto {
  /**
   * Admin ID
   */
  @ApiProperty({ name: 'id', description: 'Admin ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  /**
   * Admin password
   */
  @ApiProperty({ name: 'password', description: 'Admin password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * Google Sign In DTO
 */
export class SignInGoogleDto extends SignInDto {}

/**
 * Apple Sign In DTO
 */
export class SignInAppleDto extends SignInDto {}

export class UpdateUserDto {
  @ApiProperty({ name: 'country' })
  @IsString()
  country?: string;

  @ApiProperty({ name: 'gender' })
  @IsString()
  gender: string;

  @ApiProperty({ name: 'age', example: 30 })
  @IsNumber()
  age?: number;

  @ApiProperty({ name: 'occupation', example: 'Software Engineer' })
  @IsString()
  occupation?: string;

  @ApiProperty({ name: 'aboutMe', example: 'I am a software engineer' })
  @IsString()
  aboutMe?: string;
}
