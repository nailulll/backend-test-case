import { Module } from "@nestjs/common";
import { MemberController } from "./application/controllers/member.controller";
import { MemberService } from "./application/services/member.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "./domain/entities/member.entity";
import { MemberRepositoryToken } from "./domain/repositories/member.repository.interface";
import { MemberRepositoryImpl } from "./infrastructure/member.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MemberController],
  providers: [
    MemberService,
    {
      provide: MemberRepositoryToken,
      useClass: MemberRepositoryImpl,
    },
  ],
})
export class MemberModule {
}
