import { HttpException, Inject, Injectable } from "@nestjs/common";
import { BookRepository, BookRepositoryToken } from "../../domain/repositories/book.repository.interface";
import { BorrowBook } from "../../domain/dto/borrow.book";
import {
  MemberRepository,
  MemberRepositoryToken,
} from "../../../member/domain/repositories/member.repository.interface";
import { ReturnBookDto } from "../../domain/dto/return-book.dto";

@Injectable()
export class BookService {

  constructor(
    @Inject(BookRepositoryToken) private readonly bookRepository: BookRepository,
    @Inject(MemberRepositoryToken) private readonly memberRepository: MemberRepository,
  ) {
  }

  findAll() {
    return this.bookRepository.findAll();
  }

  async borrowBook(dto: BorrowBook) {

    const memberExist = await this.memberRepository.memberExist(dto.memberCode);

    if (!memberExist) {
      throw new HttpException("Member not found", 400);
    }

    const isCanBorrow = await this.bookRepository.checkNumberOfBorrow(dto.memberCode);
    if (!isCanBorrow) {
      throw new HttpException("Maximum books borrowed are 2", 400);
    }

    const isExist = await this.bookRepository.checkStock(dto.bookCode);
    if (!isExist) {
      throw new HttpException("Empty stock", 400);
    }

    const isPenalty = await this.memberRepository.isPenalty(dto.memberCode);
    if (isPenalty) {
      throw new HttpException("You get a penalty", 400);
    }

    await this.bookRepository.borrowBook(dto);

    return {
      msg: "Success borrowed",
    };

  }

  async returnBook(dto: ReturnBookDto) {
    const book = await this.bookRepository.checkBorrowedBook(dto);

    if (!book) {
      throw new HttpException("Not valid book", 400);
    }

    const borrowedDate = new Date(book.borrowedAt);
    const currentDate = new Date();
    const dayDiff = currentDate.getDate() - borrowedDate.getDate();

    if (dayDiff > 7) {
      const member = await this.memberRepository.memberExist(dto.memberCode);
      const penalty = new Date(currentDate.getTime() + (3 * 24 * 60 * 60 * 1000));

      await this.memberRepository.givePenalty(member, penalty);
    }

    await this.bookRepository.updateStock(dto.bookCode, book.stock + 1);

    return { msg: "Book returned successfully" };
  }

}
