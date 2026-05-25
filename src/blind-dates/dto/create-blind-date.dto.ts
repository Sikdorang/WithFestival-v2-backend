import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Gender } from '../../../generated/prisma/client';
import { OPENAPI_CREATE_BLIND_DATE } from '../../swagger/blind-dates/dto.openapi';

/**
 * 소개팅 명단 응모 본문(공개).
 * `numberDelivered` 는 운영자 표시용이라 본 DTO에서 받지 않고
 * 서비스가 항상 `false` 로 저장합니다.
 */
export class CreateBlindDateDto {
  @ApiProperty(OPENAPI_CREATE_BLIND_DATE.name)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty(OPENAPI_CREATE_BLIND_DATE.age)
  @IsInt()
  @Min(1)
  @Max(150)
  age: number;

  @ApiProperty(OPENAPI_CREATE_BLIND_DATE.contact)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  contact: string;

  @ApiProperty(OPENAPI_CREATE_BLIND_DATE.mbti)
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  mbti: string;

  @ApiProperty(OPENAPI_CREATE_BLIND_DATE.appearanceStyle)
  @IsInt()
  @Min(0)
  @Max(100)
  appearanceStyle: number;

  @ApiProperty(OPENAPI_CREATE_BLIND_DATE.gender)
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty(OPENAPI_CREATE_BLIND_DATE.deliveryPhone)
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  deliveryPhone: string;
}
