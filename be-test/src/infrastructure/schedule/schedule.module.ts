import { Module } from "@nestjs/common";
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule";
import { TaskService } from "./task.service";
import { MemberRepositoryToken } from "../../modules/member/domain/repositories/member.repository.interface";
import { MemberRepositoryImpl } from "../../modules/member/infrastructure/member.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "../../modules/member/domain/entities/member.entity";

@Module({
  imports: [NestScheduleModule.forRoot(), TypeOrmModule.forFeature([Member])],
  providers: [
    TaskService,
    {
      provide: MemberRepositoryToken,
      useClass: MemberRepositoryImpl,
    },
  ],
})
export class ScheduleModule {
}
