import { Global, Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import  * as winston from "winston";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { ValidationService } from "./validation.service";
import { APP_FILTER } from "@nestjs/core";
import { ErrorFilter } from "./error.filter";

@Global()
@Module({
  imports: [
    // Setup Nest Logger using winston
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [new winston.transports.Console()]
    }),

    // Setup Nest Config Module for global configuration
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter
    }],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
