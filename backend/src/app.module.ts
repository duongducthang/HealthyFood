import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { FoodsModule } from "./foods/foods.module";
import { CaloriesModule } from "./calories/calories.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 180,
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    FoodsModule,
    CaloriesModule,
  ],
})
export class AppModule {}

