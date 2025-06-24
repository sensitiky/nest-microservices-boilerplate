import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthStrategy } from '../../infrastructure/types/auth-strategy.type';
import { AuthChannel } from '@api/common';
import { AuthServiceSymbol } from '../../domain/symbols/auth.symbol';

@Injectable()
export class AuthFactoryService {
  constructor(
    @Inject(AuthServiceSymbol) private readonly authService: AuthService,
  ) {}
  get(channel: AuthChannel): AuthStrategy {
    switch (channel) {
      case AuthChannel.email:
        return this.authService;
    }
  }
}
