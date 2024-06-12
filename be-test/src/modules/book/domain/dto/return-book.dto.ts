import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ReturnBookDto {
  @ApiProperty()
  @IsNotEmpty()
  memberCode: string;

  @ApiProperty()
  @IsNotEmpty()
  bookCode: string
}