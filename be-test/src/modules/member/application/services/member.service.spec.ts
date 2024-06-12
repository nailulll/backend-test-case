import { Test, TestingModule } from "@nestjs/testing";
import { MemberService } from "./member.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfig } from "../../../../infrastructure/database/database.config";
import { Member } from "../../domain/entities/member.entity";
import { MemberRepositoryToken } from "../../domain/repositories/member.repository.interface";
import { MemberRepositoryImpl } from "../../infrastructure/member.repository";
import { Repository } from "typeorm";
import { membersMock } from "../../../../mock";

describe("MemberService", () => {
  let service: MemberService;
  let repository: Repository<Member>;

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
        TypeOrmModule.forFeature([Member]),
      ],
      providers: [
        MemberService,
        {
          provide: MemberRepositoryToken,
          useClass: MemberRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get("MemberRepository");
    await repository.save(membersMock);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return members", async () => {
    const members = await service.findAll();

    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);

    members.forEach(member => {
      expect(member).toHaveProperty("code");
      expect(member).toHaveProperty("name");
      expect(member).toHaveProperty("borrowed");
      expect(member).toHaveProperty("bannedAt");
    });
  });

  afterEach(async () => {
    for (const member of membersMock) {
      await repository.delete({ code: member.code });
    }
  });

});
