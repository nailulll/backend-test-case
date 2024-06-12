import { Module } from "@nestjs/common";
import { DatabaseConfig } from "./database.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { SeederModule } from "./seeder/seeder.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
      inject: [ConfigService],
    }),
    SeederModule,
  ],
  providers: [DatabaseConfig],
})
export class DatabaseModule {
}
