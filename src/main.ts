import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./common/exception-filters/http-exception.filter";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle("Course management API")
        .setDescription("An API for system of course management")
        .setVersion("1.0")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "JWT-auth")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    app.useGlobalFilters(new HttpExceptionFilter());

    const configService = app.get(ConfigService);
    const PORT = configService.get("app.port");

    app.use(cookieParser());

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
