import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { OPENAPI_LIST_BLIND_DATES } from '../../swagger/blind-dates/dto.openapi';

/**
 * `GET /blind-dates` 본문(인증).
 * GET 메서드에 본문을 사용하는 비표준 패턴이라는 점에 주의(Swagger 문서에 안내).
 */
export class ListBlindDatesDto {
  @ApiProperty(OPENAPI_LIST_BLIND_DATES.password)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;
}
