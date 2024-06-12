import { Book } from "../domain/entities/book";
import { BookRepository } from "../domain/repositories/book.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { Injectable } from "@nestjs/common";
import { BorrowBook } from "../domain/dto/borrow.book";
import { Member } from "../../member/domain/entities/member.entity";
import { ReturnBookDto } from "../domain/dto/return-book.dto";

@Injectable()
export class BookRepositoryImpl implements BookRepository {

  constructor(@InjectRepository(Book) private readonly bookRepository: Repository<Book>) {
  }

  findAll() {
    return this.bookRepository.find({
      where: {
        stock: MoreThan(0),
      },
    });
  }

  async borrowBook(dto: BorrowBook) {
    const member = new Member();
    member.code = dto.memberCode;
    const book = await this.bookRepository.findOne({
      where: {
        code: dto.bookCode,
      },
      select: {
        stock: true,
      },
    });

    await this.bookRepository.update({ code: dto.bookCode }, { member, borrowedAt: new Date(), stock: --book.stock });
  }

  async checkNumberOfBorrow(memberCode: string) {
    const member = new Member();
    member.code = memberCode;

    const books = await this.bookRepository.find({
      where: {
        member,
      },
    });

    return books.length < 2;
  }

  async checkStock(bookCode: string) {
    const book = await this.bookRepository.findOne({
      where: {
        code: bookCode,
      },
    });
    return book.stock > 0;
  }

  async checkBorrowedBook(dto: ReturnBookDto) {
    const member = new Member();
    member.code = dto.memberCode;
    return this.bookRepository.findOne({
      where: {
        code: dto.bookCode,
        member,
      },
    });
  }

  async updateStock(bookCode: string, stock: number) {
    await this.bookRepository.update({ code: bookCode }, { stock, borrowedAt: null, member: null });
  }

}