import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "../infrastructure/database/database.module";
import { BookModule } from "./book/book.module";
import { MemberModule } from "./member/member.module";
import { ScheduleModule } from "../infrastructure/schedule/schedule.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule,
    DatabaseModule,
    BookModule,
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
