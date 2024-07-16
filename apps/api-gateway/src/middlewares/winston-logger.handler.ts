
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import { randomUUID } from 'crypto';
import { DEFAULT_AWS_REGION, DEFAULT_MONGODB_URI } from '@libs/constants/src';
import { NodeEnvironment } from '@libs/shared/src';
import S3Transport from 'winston-s3-transport';

// custom log display format
const customFormat = format.printf(({ timestamp, level, stack, message }) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`;
});

@Injectable()
export class WinstonLoggerService {
  private logger;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService
  ) {
    const options = {
      file: {
        filename: 'error.log',
        level: 'error',
      },
      console: {
        level: 'silly',
      },
    };

    const awsClientOptions = {
      region: process.env.AWS_REGION ?? DEFAULT_AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'accessKeyId',
        secretAccessKey: process.env.AWS_SECRET_KEY ?? 'accessKey',
      },
    };

    // for development environment
    const devLogger = {
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.metadata(),
        customFormat
      ),
      transports: [
        new transports.Console(options.console),
        new transports.File(options.file),
        new transports.File({
          filename: 'combine.log',
          level: 'info',
        }),
        new transports.MongoDB({
          db: this.configService.get("MONGO_URI") ?? DEFAULT_MONGODB_URI,
          dbName: process.env.MONGO_DB_NAME,
          options: { useUnifiedTopology: true },
          collection: 'logs',
          level: 'info',
        }),
      ],
    };

    // for production environment
    const prodLogger = {
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.metadata(),
        customFormat
      ),
      transports: [
        new transports.Console(options.console),
        new transports.MongoDB({
          db: this.configService.get("MONGO_URI") ?? DEFAULT_MONGODB_URI,
          dbName: process.env.MONGO_DB_NAME,
          options: { useUnifiedTopology: true },
          collection: 'logs',
          level: 'info',
        }),
        new S3Transport({
          s3ClientConfig: awsClientOptions,
          s3TransportConfig: {
            bucket: process.env.AWS_LOGS_BUCKET_NAME || 'error-logs',
            group: (logInfo) => {
              // Group logs with `userId` value and store them in memory.
              // If the 'userId' value does not exist, use the `anonymous` group.
              const userId = (logInfo as { metadata?: { userId?: string } })?.metadata?.userId;
              const serviceName = process.env.SERVICE_NAME || 'api-gateway';
              return userId ? `${userId}/${serviceName}` : serviceName;
            },
            bucketPath: (group = 'default') => {
              const date = new Date()
                .toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  timeZone: 'Europe/Istanbul',
                })
                .replace(/\//g, '.');

              // generate uuid from date
              const uuid = randomUUID();

              // The bucket path in which the log is uploaded.
              // You can create a bucket path by combining `group`, `timestamp`, and `uuid` values.
              return `${group}/${date}/${uuid}.log`;
            },
          },
        }),
      ],
    };

    const instanceLogger = prodLogger;
    this.logger = createLogger(instanceLogger);
  }

  log(level: string, message: string, meta: any[]) {
    this.logger.log(level, message, meta);
  }

  info(message: string, ...meta: any[]) {
    this.logger.info(message, meta);
  }

  error(message: string | object, ...meta: any[]) {
    this.logger.error(message.toString(), meta);
  }
}
