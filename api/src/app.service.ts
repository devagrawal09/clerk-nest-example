import { Inject, Injectable } from '@nestjs/common';
import { CLERK, ClerkService } from './clerk.guard';

@Injectable()
export class AppService {
  constructor(@Inject(CLERK) private readonly clerk: ClerkService) {}

  async getHello(userId?: string) {
    if (!userId) {
      return 'Hello, stranger!';
    } else {
      const user = await this.clerk.users.getUser(userId);
      return `Hello, ${user.firstName} ${user.lastName}!`;
    }
  }

  async getWelcome(userId: string) {
    const user = await this.clerk.users.getUser(userId);
    return `Welcome, ${user.firstName} ${user.lastName}!`;
  }
}
