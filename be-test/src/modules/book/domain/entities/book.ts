import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Member } from "../../../member/domain/entities/member.entity";

@Entity("books")
export class Book {
  @PrimaryColumn()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @Column({ nullable: true })
  borrowedAt?: Date;

  @ManyToOne(() => Member, member => member.books)
  @JoinColumn({ name: "member_code" })
  member?: Member;
}