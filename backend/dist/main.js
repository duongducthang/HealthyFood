"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
function parseOrigins(value) {
    return (value ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["log", "error", "warn"],
    });
    const config = app.get(config_1.ConfigService);
    const port = Number(config.get("PORT") ?? "5001");
    app.use((0, helmet_1.default)());
    const origins = parseOrigins(config.get("CORS_ORIGINS"));
    app.enableCors({
        origin: origins.length > 0 ? origins : true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(port);
    console.log(`API listening on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map