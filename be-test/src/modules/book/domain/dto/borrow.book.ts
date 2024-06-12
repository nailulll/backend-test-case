import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class BorrowBook {
  @ApiProperty()
  @IsNotEmpty()
  memberCode: string;

  @ApiProperty()
  @IsNotEmpty()
  bookCode: string
}