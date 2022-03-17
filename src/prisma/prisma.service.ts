import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://example:example@localhost:5434/mydb?schema=public',
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });
    this.logger.log(`Prisma v${Prisma.prismaVersion.client}`);
    this.$on<any>('query', (e: Prisma.QueryEvent) => {
      this.logger.debug('Query: ' + e.query);
      this.logger.debug('Params: ' + e.params);
      this.logger.debug('Duration: ' + e.duration + 'ms');
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
