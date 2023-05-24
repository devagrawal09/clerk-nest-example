import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Module,
  Inject,
  ConfigurableModuleBuilder,
  DynamicModule,
} from '@nestjs/common';
import { Clerk } from '@clerk/clerk-sdk-node';

export const CLERK = 'CLERK';
export type ClerkService = ReturnType<typeof Clerk>;

type ClerkKeys = { secretKey: string; publishableKey: string };

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: CLERK_KEYS,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ClerkKeys>()
  .setClassMethodName('forRoot')
  .build();

@Injectable()
export class ClerkGuard implements CanActivate {
  constructor(
    @Inject(CLERK) private readonly clerk: ClerkService,
    @Inject(CLERK_KEYS) private readonly clerkKeys: ClerkKeys,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return true;
    }

    const headerToken: string | undefined = authHeader.split(' ')[1];

    if (!headerToken) {
      return true;
    }

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
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return false;
    }

    const headerToken: string | undefined = authHeader.split(' ')[1];

    if (!headerToken) {
      return false;
    }

    const res = await this.clerk.authenticateRequest({
      headerToken,
      apiKey: ``,
      frontendApi: ``,
      host: ``,
      secretKey: this.clerkKeys.secretKey,
      publishableKey: this.clerkKeys.publishableKey,
    });

    if (!res.isSignedIn) {
      return false;
    }

    req.auth = res.toAuth();

    return true;
  }
}

@Module({})
export class ClerkModule extends ConfigurableModuleClass {
  private static hydrateModule(module: DynamicModule): DynamicModule {
    return {
      ...module,
      providers: [
        ...module.providers,
        {
          provide: CLERK,
          useFactory: (clerkKeys: ClerkKeys) =>
            Clerk({ secretKey: clerkKeys.secretKey }),
          inject: [CLERK_KEYS],
        },
      ],
      exports: [CLERK, CLERK_KEYS],
    };
  }

  static forRoot(options: typeof OPTIONS_TYPE): DynamicModule {
    return this.hydrateModule(super.forRoot(options));
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return this.hydrateModule(super.forRootAsync(options));
  }
}
