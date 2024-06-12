import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Book } from "../../modules/book/domain/entities/book";
import { Member } from "../../modules/member/domain/entities/member.entity";

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mysql",
      host: this.configService.get("DB_HOST"),
      port: this.configService.get("DB_PORT"),
      username: this.configService.get("DB_USERNAME"),
      password: this.configService.get("DB_PASSWORD"),
      database: this.configService.get("DB_NAME"),
      entities: [Book, Member],
      synchronize: true,
    };
  }
}
