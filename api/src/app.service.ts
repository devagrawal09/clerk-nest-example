import { Inject, Injectable } from '@nestjs/common';
import { CLERK, ClerkService } from './clerk.guard';

@Injectable()
export class AppService {
  constructor(@Inject(CLERK) private readonly clerk: ClerkService) {}
  getHello() {
    return 'Hello World!';
  }

  async getWelcome(userId: string) {
    const user = await this.clerk.users.getUser(userId);
    return `Welcome, ${user.firstName} ${user.lastName}!`;
  }
}
