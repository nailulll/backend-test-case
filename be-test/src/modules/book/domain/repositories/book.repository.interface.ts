import { Book } from "../entities/book";
import { BorrowBook } from "../dto/borrow.book";
import { ReturnBookDto } from "../dto/return-book.dto";

export const BookRepositoryToken = Symbol("BookRepository");

export interface BookRepository {
  /**
   * Shows all existing books and quantities
   */
  findAll(): Promise<Book[]>;

  /**
   * To borrow book
   * @param dto
   */
  borrowBook(dto: BorrowBook): Promise<void>;

  /**
   * Check the number of books borrowed by members
   * @param memberCode
   */
  checkNumberOfBorrow(memberCode: string): Promise<boolean>;

  /**
   * Check the stock of available books
   * @param bookCode
   */
  checkStock(bookCode: string): Promise<boolean>;

  /**
   * Check the books borrowed according to the member
   * @param dto
   */
  checkBorrowedBook(dto: ReturnBookDto): Promise<Book>;

  /**
   * Update stock
   * @param bookCode
   * @param stock
   */
  updateStock(bookCode: string, stock: number): Promise<void>;
}
