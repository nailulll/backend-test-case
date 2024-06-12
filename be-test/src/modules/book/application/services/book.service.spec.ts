import { Test, TestingModule } from "@nestjs/testing";
import { BookService } from "./book.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfig } from "../../../../infrastructure/database/database.config";
import { Member } from "../../../member/domain/entities/member.entity";
import { Book } from "../../domain/entities/book";
import { Repository } from "typeorm";
import { booksMock, membersMock } from "../../../../mock";
import { MemberRepositoryToken } from "../../../member/domain/repositories/member.repository.interface";
import { MemberRepositoryImpl } from "../../../member/infrastructure/member.repository";
import { BookRepositoryToken } from "../../domain/repositories/book.repository.interface";
import { BookRepositoryImpl } from "../../infrastructure/book.repository";
import { BorrowBook } from "../../domain/dto/borrow.book";
import { HttpException } from "@nestjs/common";

describe("BookService", () => {
  let service: BookService;
  let bookRepository: Repository<Book>;
  let memberRepository: Repository<Member>;

  const borrowBook1_M001: BorrowBook = {
    memberCode: "M001",
    bookCode: "HOB-83",
  };

  const borrowBook2_M001: BorrowBook = {
    memberCode: "M001",
    bookCode: "JK-45",
  };

  const borrowBook3_M001: BorrowBook = {
    memberCode: "M001",
    bookCode: "TW-11",
  };

  const borrowBook1_M002: BorrowBook = {
    memberCode: "M002",
    bookCode: "SHR-1",
  };

  const resetDatabase = async () => {
    for (const book of booksMock) {
      await bookRepository.delete({ code: book.code });
    }
    for (let member of membersMock) {
      await memberRepository.delete({ code: member.code });
    }
  };

  const fillDatabase = async () => {
    await bookRepository.save(booksMock);
    await memberRepository.save(membersMock);
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useClass: DatabaseConfig,
        }),
        TypeOrmModule.forFeature([Member, Book]),
      ],
      providers: [
        BookService,
        {
          provide: MemberRepositoryToken,
          useClass: MemberRepositoryImpl,
        },
        {
          provide: BookRepositoryToken,
          useClass: BookRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get("BookRepository");
    memberRepository = module.get("MemberRepository");
    await fillDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return books", async () => {
    const books = await service.findAll();

    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);

    books.forEach(book => {
      expect(book).toHaveProperty("code");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
      expect(book).toHaveProperty("stock");
      expect(book).toHaveProperty("borrowedAt");
    });
  });

  it("should borrowed book", async () => {
    const result = await service.borrowBook(borrowBook1_M001);
    expect(result).toStrictEqual({ "msg": "Success borrowed" });
  });

  it("should member not found", async () => {
    jest.spyOn(bookRepository, "findOne").mockResolvedValue(null);
    await expect(service.borrowBook({
      ...borrowBook1_M001,
      memberCode: "M0010",
    })).rejects.toThrow(new HttpException("Member not found", 400));
  });

  it("should maximum borrowed", async () => {
    await resetDatabase();
    await fillDatabase();

    const result1 = await service.borrowBook(borrowBook1_M001);
    const result2 = await service.borrowBook(borrowBook2_M001);

    expect(result1).toStrictEqual({ "msg": "Success borrowed" });
    expect(result2).toStrictEqual({ "msg": "Success borrowed" });

    await expect(service.borrowBook(borrowBook3_M001)).rejects.toThrow(new HttpException("Maximum books borrowed are 2", 400));
  });

  it("should empty stock", async () => {
    await resetDatabase();
    await fillDatabase();

    const result1 = await service.borrowBook(borrowBook1_M001);

    expect(result1).toStrictEqual({ "msg": "Success borrowed" });
    await expect(service.borrowBook({
      ...borrowBook1_M002,
      bookCode: "HOB-83",
    })).rejects.toThrow(new HttpException("Empty stock", 400));
  });

  it("should get penalty", async () => {
    await resetDatabase();
    await fillDatabase();

    const date = new Date();
    date.setDate(date.getDate() + 3);

    await memberRepository.update({ code: borrowBook2_M001.memberCode }, { bannedAt: date });

    await expect(service.borrowBook(borrowBook1_M001)).rejects.toThrow(new HttpException("You get a penalty", 400));

  });

  it("should success return book", async () => {
    await resetDatabase();
    await fillDatabase();

    const result1 = await service.borrowBook(borrowBook1_M001);
    expect(result1).toStrictEqual({ "msg": "Success borrowed" });

    const result2 = await service.returnBook(borrowBook1_M001);
    expect(result2).toStrictEqual({ "msg": "Book returned successfully" });
  });

  it("should add penalty to member", async () => {
    await resetDatabase();
    await fillDatabase();

    const result1 = await service.borrowBook(borrowBook1_M001);
    expect(result1).toStrictEqual({ "msg": "Success borrowed" });

    const date = new Date();
    date.setDate(date.getDate() - 8);

    await bookRepository.update({ code: borrowBook1_M001.bookCode }, {
      borrowedAt: date,
    });

    const result2 = await service.returnBook(borrowBook1_M001);
    expect(result2).toStrictEqual({ "msg": "Book returned successfully" });

    await expect(service.borrowBook(borrowBook1_M001)).rejects.toThrow(new HttpException("You get a penalty", 400));
  });

});
