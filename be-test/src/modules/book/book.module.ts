import { Module } from "@nestjs/common";
import { BookService } from "./application/services/book.service";
import { BookController } from "./application/controllers/book.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./domain/entities/book";
import { BookRepositoryImpl } from "./infrastructure/book.repository";
import { BookRepositoryToken } from "./domain/repositories/book.repository.interface";
import { MemberRepositoryToken } from "../member/domain/repositories/member.repository.interface";
import { MemberRepositoryImpl } from "../member/infrastructure/member.repository";
import { Member } from "../member/domain/entities/member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Book, Member])],
  providers: [
    {
      provide: BookRepositoryToken,
      useClass: BookRepositoryImpl,
    },
    {
      provide: MemberRepositoryToken,
      useClass: MemberRepositoryImpl,
    },
    BookService,
  ],
  controllers: [BookController],
})
export class BookModule {
}
