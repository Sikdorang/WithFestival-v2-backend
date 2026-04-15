import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { OPENAPI_CREATE_ORDER } from '../../swagger/orders/dto.openapi';

export class CreateOrderItemDto {
  @ApiProperty({ ...OPENAPI_CREATE_ORDER.item.menuId })
  @IsInt()
  @Min(1)
  menuId: number;

  @ApiProperty({ ...OPENAPI_CREATE_ORDER.item.price })
  @IsInt()
  @Min(0)
  @Max(2_000_000_000)
  price: number;

  @ApiProperty({ ...OPENAPI_CREATE_ORDER.item.quantity })
  @IsInt()
  @Min(1)
  @Max(1_000_000)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto], ...OPENAPI_CREATE_ORDER.items })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ ...OPENAPI_CREATE_ORDER.totalPrice })
  @IsInt()
  @Min(0)
  @Max(2_000_000_000)
  totalPrice: number;

  @ApiProperty({ ...OPENAPI_CREATE_ORDER.depositorName })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  depositorName: string;
}
