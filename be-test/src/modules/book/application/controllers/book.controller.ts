import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { BookService } from "../services/book.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { BorrowBook } from "../../domain/dto/borrow.book";
import { ReturnBookDto } from "../../domain/dto/return-book.dto";

@ApiTags("books")
@Controller("books")
export class BookController {

  constructor(private readonly bookService: BookService) {
  }

  @Get()
  @ApiOperation({ description: "Shows all existing books and quantities" })
  findAll() {
    return this.bookService.findAll();
  }

  @Post("borrow")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Borrow book" })
  borrowBook(@Body() dto: BorrowBook) {
    return this.bookService.borrowBook(dto);
  }

  @Post("returned")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: "Returned book" })
  returnBook(@Body() dto: ReturnBookDto) {
    return this.bookService.returnBook(dto);
  }

}
