export class LoginDto {
  country: string;
  language: string;
  gender: string;
  email: string;
  sns_id: string;
  sns: string;
  access_token: string;
}

export class PostUserDto {
  serverAuthCode: string;
  country: string;
}
