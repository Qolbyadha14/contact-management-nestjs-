import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserRequest {
  @ApiProperty({
    example: 'username_test',
    required: true
  })
  username: string;

  @ApiProperty({
    example: '1234578910',
    required: true
  })
  password: string;

  @ApiProperty({
    example: 'My Name Is',
    required: true
  })
  name: string;
}

export class UserResponse {
  username: string;
  name: string;
  token?: string;
}

export class LoginUserRequest {
  @ApiProperty({
    example: 'username_test',
    required: true
  })
  username: string;
  @ApiProperty({
    example: '1234578910',
    required: true
  })
  password: string;
}

export class UpdateUserRequest {
  @ApiProperty({
    example: 'My Name Is',
    required: false
  })
  name?: string;
  @ApiProperty({
    example: '1234578910',
    required: false
  })
  password?: string;
}
