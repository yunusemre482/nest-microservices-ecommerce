import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@libs/common/src/database/database.module';
import { UserRepository } from './repositories/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@libs/models/src';
import { InternationalizationModule } from '@libs/common/src/internationalization/internationalization.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development', '.env.development.example','.env.production','.env.production.example'],
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    InternationalizationModule
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository],
})
export class AppModule { }
