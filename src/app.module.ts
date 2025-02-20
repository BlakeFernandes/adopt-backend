import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PuppiesModule } from './puppies/puppies.module';

import * as dotenv from 'dotenv';
import { AdoptModule as AdoptersModule } from './adopters/adopters.module';
import { DatabaseModule } from './database/database.module';

dotenv.config();

function checkRequiredEnvVars() {
  const requiredVars = ['DATABASE_URL'];

  const missingVars = requiredVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        checkRequiredEnvVars();

        return {
          uri: process.env.DATABASE_URL,
        };
      },
    }),
    DatabaseModule,
    PuppiesModule,
    AdoptersModule,
  ],
  providers: [],
})
export class AppModule {}
