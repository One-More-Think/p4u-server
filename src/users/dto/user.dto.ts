import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

class SignInDto {
  /**
   * Third-party sub id
   */
  @ApiProperty({ name: 'idToken', description: 'Third-party sub id' })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({ name: 'country', description: 'user location from the app' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

/**
 * Google Sign In DTO
 */
export class SignInGoogleDto extends SignInDto {}

/**
 * Apple Sign In DTO
 */
export class SignInAppleDto extends SignInDto {}
