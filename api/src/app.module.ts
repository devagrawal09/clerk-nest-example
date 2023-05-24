import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClerkModule } from './clerk.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

// example with environment variables passed in directly
// @Module({
//   imports: [
//     ClerkModule.forRoot({
//       secretKey: process.env.CLERK_KEY,
//       publishableKey: process.env.CLERK_PUB_KEY,
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

// example with config module
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClerkModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretKey: configService.get('CLERK_KEY'),
        publishableKey: configService.get('CLERK_PUB_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
