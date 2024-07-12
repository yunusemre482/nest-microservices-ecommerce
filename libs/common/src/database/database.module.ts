import { Module, Logger } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') ?? "mongodb://root:example@localhost:27017/?authMechanism=DEFAULT&authSource=admin",
        connectionFactory: (connection: Connection) => {
          if (connection.readyState === 1) {
            Logger.log('DB connected');
          }

          connection.on('disconnected', () => {
            Logger.log('DB disconnected');
          });

          return connection;
        },
      }),
      inject: [ConfigService]
    }),
  ],
})
export class DatabaseModule { }
