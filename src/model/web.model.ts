import { ApiProperty } from '@nestjs/swagger';

export class WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: Paging
}

export class Paging {
  @ApiProperty({
    example: 1,
    required: true
  })
  current_page: number;

  @ApiProperty({
    example: 10,
    required: true
  })
  total_page: number;

  @ApiProperty({
    example: 10,
    required: true
  })
  size: number
}