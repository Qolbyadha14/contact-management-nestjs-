import { PrismaClient,Prisma } from '@prisma/client';
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";

// @ts-ignore
@Injectable()
export class PrismaService extends PrismaClient<
  Prisma.PrismaClientOptions,
  string> implements OnModuleInit {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger ) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  onModuleInit() {
    this.$on('query', (e: any) => {
      this.logger.debug(e);
    });
    this.$on('error', (e: any) => {
      this.logger.error(e);
    });
    this.$on('info', (e: any) => {
      this.logger.info(e);
    });
    this.$on('warn', (e: any) => {
      this.logger.warn(e);
    });
  }
}