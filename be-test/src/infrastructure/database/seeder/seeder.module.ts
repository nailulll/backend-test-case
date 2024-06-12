import { Module } from "@nestjs/common";
import { SeederBookService } from "./seeder-book.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "../../../modules/book/domain/entities/book";
import { Member } from "../../../modules/member/domain/entities/member.entity";
import { SeederMemberService } from "./seeder-member.service";

@Module({
  imports: [TypeOrmModule.forFeature([Book, Member])],
  providers: [SeederBookService, SeederMemberService],
})
export class SeederModule {
}
