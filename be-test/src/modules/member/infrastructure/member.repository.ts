import { Member } from "../domain/entities/member.entity";
import { MemberRepository } from "../domain/repositories/member.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MemberRepositoryImpl implements MemberRepository {

  constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>) {
  }

  async removeMembersPenalty() {
    const members = await this.memberRepository.find();
    const now = new Date();

    for (const member of members) {
      if (member.bannedAt) {
        const penaltyEndDate = new Date(member.bannedAt);
        penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);
        if (now >= penaltyEndDate) {
          await this.memberRepository.update(
            { code: member.code },
            { bannedAt: null },
          );
        }
      }
    }
  }

  findAll() {
    return this.memberRepository.find({
      relations: {
        books: true,
      },
    });
  }

  async isPenalty(memberCode: string) {
    const member = await this.memberRepository.findOne({
      where: {
        code: memberCode,
      },
    });

    const now = new Date();
    const penaltyEndDate = new Date(member.bannedAt);
    penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);

    return now < penaltyEndDate;

  }

  memberExist(memberCode: string) {
    return this.memberRepository.findOne({ where: { code: memberCode } });
  }

  async givePenalty(member: Member, until: Date) {
    await this.memberRepository.update({ code: member.code }, { bannedAt: until });
  }
}