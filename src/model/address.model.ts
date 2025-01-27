import { ApiProperty } from '@nestjs/swagger';

export class AddressResponse {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postal_code: string;
}

export class CreateAddressRequest {
  @ApiProperty({
    example: 1,
    required: true
  })
  contact_id: number;

  @ApiProperty({
    example: 'Jalan Jalan',
    required: true
  })
  street?: string;

  @ApiProperty({
    example: 'Jakarta',
    required: true
  })
  city?: string;

  @ApiProperty({
    example: 'DKI Jakarta',
    required: true
  })
  province?: string;

  @ApiProperty({
    example: 'Indonesia',
    required: true
  })
  country: string;

  @ApiProperty({
    example: '123456',
    required: true
  })
  postal_code: string;
}


export class GetAddressRequest {
  contact_id: number;
  address_id: number;
}

export class UpdateAddressRequest {
  @ApiProperty({
    example: 1,
    required: true
  })
  id: number;

  @ApiProperty({
    example: 1,
    required: true
  })
  contact_id: number;

  @ApiProperty({
    example: 'Jalan Jalan',
    required: false
  })
  street?: string;

  @ApiProperty({
    example: 'Jakarta',
    required: false
  })
  city?: string;

  @ApiProperty({
    example: 'DKI Jakarta',
    required: false
  })
  province?: string;

  @ApiProperty({
    example: 'Indonesia',
    required: false
  })
  country: string;

  @ApiProperty({
    example: '123456',
    required: false
  })
  postal_code: string;
}

export class RemoveAddressRequest {
  contact_id: number;
  address_id: number;
}