import { Auth, LoginDto, RegisterDto } from '@api/common';
import {
  IAuthExecuter,
  IAuthRegister,
  IAuthTokenizer,
} from '../../domain/services/auth.service.interface';

export type AuthStrategy = EmailStrategy & OtpStrategy;

type EmailStrategy = IAuthExecuter<Auth, LoginDto> &
  IAuthRegister<Auth, RegisterDto> &
  IAuthTokenizer<string, boolean | Auth>;

type OtpStrategy = IAuthExecuter<Auth, LoginDto>;
