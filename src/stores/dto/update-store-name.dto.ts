import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateStoreNameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;
}
