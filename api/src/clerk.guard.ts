import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
  Module,
  Inject,
} from '@nestjs/common';
import { Clerk } from '@clerk/clerk-sdk-node';

export const CLERK = 'CLERK';
export type ClerkService = ReturnType<typeof Clerk>;

const CLERK_KEYS = 'CLERK_KEYS';
type ClerkKeys = { secretKey: string; publishableKey: string };

@Injectable()
export class ClerkGuard implements CanActivate {
  constructor(
    @Inject(CLERK) private readonly clerk: ClerkService,
    @Inject(CLERK_KEYS) private readonly clerkKeys: ClerkKeys,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const headerToken: string = req.headers.authorization.split(' ')[1];

    const res = await this.clerk.authenticateRequest({
      headerToken,
      apiKey: ``,
      frontendApi: ``,
      host: ``,
      secretKey: this.clerkKeys.secretKey,
      publishableKey: this.clerkKeys.publishableKey,
    });

    req.auth = res.toAuth();

    return true;
  }
}

@Injectable()
export class ClerkRequiredGuard implements CanActivate {
  constructor(
    @Inject(CLERK) private readonly clerk: ClerkService,
    @Inject(CLERK_KEYS) private readonly clerkKeys: ClerkKeys,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token: string = req.headers.authorization.split(' ')[1];

    const res = await this.clerk.authenticateRequest({
      headerToken: token,
      apiKey: ``,
      frontendApi: ``,
      host: ``,
      secretKey: this.clerkKeys.secretKey,
      publishableKey: this.clerkKeys.publishableKey,
    });

    if (!res.isSignedIn) {
      throw new UnauthorizedException();
    }

    req.auth = res.toAuth();

    return true;
  }
}

@Module({})
export class ClerkModule {
  static forRoot(clerkKeys: ClerkKeys) {
    return {
      module: ClerkModule,
      providers: [
        {
          provide: CLERK_KEYS,
          useValue: clerkKeys,
        },
        {
          provide: CLERK,
          useValue: Clerk({
            secretKey: clerkKeys.secretKey,
            publishableKey: clerkKeys.publishableKey,
          }),
        },
      ],
      exports: [CLERK, CLERK_KEYS],
    };
  }
}
