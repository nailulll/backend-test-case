import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Member } from "../../../modules/member/domain/entities/member.entity";
import { Repository } from "typeorm";
import { membersMock } from "../../../mock";

@Injectable()
export class SeederMemberService implements OnModuleInit, OnModuleDestroy {

  constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>) {
  }

  async onModuleDestroy() {
    for (const member of membersMock) {
      await this.memberRepository.delete({ code: member.code });
    }
    return await this.memberRepository.find();
  }

  async onModuleInit() {
    return await this.memberRepository.save(membersMock);
  }
}
