import { Inject, Injectable } from "@nestjs/common";
import { MemberRepository, MemberRepositoryToken } from "../../domain/repositories/member.repository.interface";

@Injectable()
export class MemberService {
  constructor(@Inject(MemberRepositoryToken) private readonly memberRepository: MemberRepository) {
  }

  async findAll() {
    const members = await this.memberRepository.findAll();
    const newMember = [];
    for (let member of members) {
      const borrowed = member.books.length;
      delete member.books;
      newMember.push({ ...member, borrowed });
    }
    return newMember;
  }
}
