import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClerkModule } from './clerk.guard';

@Module({
  imports: [
    ClerkModule.forRoot({
      secretKey: process.env.CLERK_KEY,
      publishableKey: process.env.CLERK_PUB_KEY,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
