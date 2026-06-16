import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError, of } from 'rxjs';
import { UserSnapshot } from '@api/common';
import { IUserServiceClient, CreateUserData } from '../../domain/ports/out/user-service-client.port';

@Injectable()
export class TcpUserServiceClient implements IUserServiceClient {
  constructor(
    @Inject('USER_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async findByEmail(email: string): Promise<UserSnapshot | null> {
    return firstValueFrom(
      this.client.send('get-user-by-email', email).pipe(catchError(() => of(null))),
    );
  }

  async create(data: CreateUserData): Promise<UserSnapshot> {
    return firstValueFrom(this.client.send('create-user', data));
  }
}
