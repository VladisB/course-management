import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { useContainer } from "class-validator";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const PORT = configService.get("app.port");

    app.use(cookieParser());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
