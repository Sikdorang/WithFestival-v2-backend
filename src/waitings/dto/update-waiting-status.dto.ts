import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { WaitingStatus } from '../../../generated/prisma/client';
import { OPENAPI_WAITING_STATUS_PATCH } from '../../swagger/waitings/dto.openapi';

export class UpdateWaitingStatusDto {
  @ApiProperty({
    ...OPENAPI_WAITING_STATUS_PATCH,
    description: '입장 처리(ENTERED) 또는 취소(CANCELED)',
  })
  @IsIn([WaitingStatus.ENTERED, WaitingStatus.CANCELED])
  status!: WaitingStatus;
}
