import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { OPENAPI_CREATE_PUBLIC_ORDER } from '../../swagger/orders/dto.openapi';
import { CreateOrderDto } from './create-order.dto';

/** JWT 없이 주문 생성 시 본문 (`Store` = 부스 — `storeId`·`boothId`는 같은 PK) */
export class CreatePublicOrderDto extends CreateOrderDto {
  @ApiProperty(OPENAPI_CREATE_PUBLIC_ORDER.storeId)
  @IsInt()
  @Min(1)
  storeId: number;

  @ApiProperty(OPENAPI_CREATE_PUBLIC_ORDER.boothId)
  @IsInt()
  @Min(1)
  boothId: number;

  @ApiProperty(OPENAPI_CREATE_PUBLIC_ORDER.tableId)
  @IsInt()
  @Min(1)
  @Max(2_000_000_000)
  tableId: number;
}
