import { Member } from "../entities/member.entity";

export const MemberRepositoryToken = Symbol("MemberRepository");

export interface MemberRepository {
  /**
   * Show all member
   */
  findAll(): Promise<Member[]>;

  /**
   * Check if member penalty
   * @param memberCode
   */
  isPenalty(memberCode: string): Promise<boolean>;

  /**
   * Remove penalty
   */
  removeMembersPenalty(): Promise<void>;

  /**
   * Check if member exist
   * @param memberCode
   */
  memberExist(memberCode: string): Promise<Member>;

  /**
   * Give member penalty until the specified time
   * @param member
   * @param until
   */
  givePenalty(member: Member, until: Date): Promise<void>;
}