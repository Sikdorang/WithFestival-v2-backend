import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { WaitingStatus } from '../../../generated/prisma/client';
import { OPENAPI_WAITING_STATUS } from '../../swagger/waitings/dto.openapi';

export class UpdateWaitingStatusDto {
  @ApiProperty({
    ...OPENAPI_WAITING_STATUS,
    description: '처리 결과에 맞는 대기 상태',
  })
  @IsEnum(WaitingStatus)
  status!: WaitingStatus;
}
