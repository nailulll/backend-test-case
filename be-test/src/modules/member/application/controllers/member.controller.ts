import { Controller, Get } from "@nestjs/common";
import { MemberService } from "../services/member.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("members")
@Controller("members")
export class MemberController {

  constructor(private readonly memberService: MemberService) {
  }

  @Get()
  @ApiOperation({ description: "Shows all existing members" })
  findAll() {
    return this.memberService.findAll();
  }

}
