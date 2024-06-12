import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Book } from "../../../book/domain/entities/book";

@Entity("members")
export class Member {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bannedAt?: Date;

  @OneToMany(() => Book, book => book.member)
  books?: Book[];
}