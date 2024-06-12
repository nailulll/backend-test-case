import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "../../../modules/book/domain/entities/book";
import { Repository } from "typeorm";
import { booksMock } from "../../../mock";

@Injectable()
export class SeederBookService implements OnModuleInit, OnModuleDestroy {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {
  }

  async onModuleInit() {
    return await this.bookRepository.save(booksMock);
  }

  async onModuleDestroy() {
    for (const book of booksMock) {
      await this.bookRepository.delete({ code: book.code });
    }
    return await this.bookRepository.find();
  }
}
