import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthStrategy } from '../../infrastructure/types/auth-strategy.type';
import { AuthChannel } from '@api/common/enums/auth.enums';

@Injectable()
export class AuthFactoryService {
  constructor(
    @Inject('IAuthService') private readonly authService: AuthService,
  ) {}
  get(channel: AuthChannel): AuthStrategy {
    switch (channel) {
      case AuthChannel.email:
        return this.authService;
    }
  }
}
