import { ApiProperty } from "@nestjs/swagger";
export class ContactResponse {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string
  phone_number?: string
}

export class CreateContactRequest {
  @ApiProperty({
    example: 'John',
    required: true
  })
  first_name: string;
  @ApiProperty({
    example: 'Doe',
    required: false
  })
  last_name?: string;
  @ApiProperty({
    example: 'jhon@example.com',
    required: false
  })
  email?: string
  @ApiProperty({
    example: '1234567890',
    required: true
  })
  phone_number?: string
}

export class UpdateContactRequest {
  @ApiProperty({
    example: 1,
    required: true
  })
  id: number;

  @ApiProperty({
    example: 'John',
    required: true
  })
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    required: false
  })
  last_name?: string;
  @ApiProperty({
    example: 'jhon@example.com',
    required: false
  })
  email?: string
  @ApiProperty({
    example: '1234567890',
    required: true
  })
  phone_number?: string
}

export class SearchContactRequest {
  @ApiProperty({
    example: 'John',
    required: false
  })
  name?: string;

  @ApiProperty({
    example: 'jhon@example.com',
    required: false
  })
  email?: string;

  @ApiProperty({
    example: '1234567890',
    required: false
  })  
  phone_number?: string;

  @ApiProperty({
    example: 1,
    required: false
  })
  page: number;

  @ApiProperty({
    example: 10,
    required: false
  })
  size: number
}