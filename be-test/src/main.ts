import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(3000);
  const url = await app.getUrl();
  logger.log(`Application running on ${url}`);
}

bootstrap();
