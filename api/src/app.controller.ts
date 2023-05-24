import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ClerkRequiredGuard } from './clerk.guard';
import { RequireAuthProp } from '@clerk/clerk-sdk-node';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  async getHello() {
    const message = this.appService.getHello();

    return { message };
  }

  @Get('/welcome')
  @UseGuards(ClerkRequiredGuard)
  async getWelcome(@Request() req: RequireAuthProp<Request>) {
    const message = await this.appService.getWelcome(req.auth.userId);

    return { message };
  }
}
