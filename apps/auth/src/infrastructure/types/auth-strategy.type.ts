import { Auth, LoginDto } from '@api/common';
import {
  EmailService,
  IAuthExecuter,
} from '../../application/ports/in/auth.service.interface';

export type AuthStrategy = EmailService & OtpStrategy;

type OtpStrategy = IAuthExecuter<Auth, LoginDto>;
