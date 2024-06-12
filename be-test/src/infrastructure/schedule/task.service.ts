import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  MemberRepository,
  MemberRepositoryToken,
} from "../../modules/member/domain/repositories/member.repository.interface";

@Injectable()
export class TaskService {
  constructor(@Inject(MemberRepositoryToken) private readonly memberRepository: MemberRepository) {
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeMembersPenalty() {
    await this.memberRepository.removeMembersPenalty();
  }

}