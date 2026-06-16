import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const DOMAIN_EXCEPTION_STATUS: Record<string, HttpStatus> = {
  UserNotFoundException: HttpStatus.NOT_FOUND,
  ProductNotFoundException: HttpStatus.NOT_FOUND,
  UserAlreadyExistsException: HttpStatus.CONFLICT,
  InvalidEmailException: HttpStatus.BAD_REQUEST,
  InvalidCredentialsException: HttpStatus.UNAUTHORIZED,
  InvalidTokenException: HttpStatus.UNAUTHORIZED,
  InvalidPriceException: HttpStatus.BAD_REQUEST,
  InvalidStockException: HttpStatus.BAD_REQUEST,
  InsufficientStockException: HttpStatus.UNPROCESSABLE_ENTITY,
};

export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        const request = context.switchToHttp().getRequest();
        const status =
          DOMAIN_EXCEPTION_STATUS[error.name] ??
          HttpStatus.INTERNAL_SERVER_ERROR;

        return throwError(
          () =>
            new HttpException(
              {
                message: error.message ?? 'An unexpected error occurred',
                timestamp: new Date().toISOString(),
                path: request.url,
              },
              status,
            ),
        );
      }),
    );
  }
}
