import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const errorResponse = {
          message: error.message ?? 'An unexpected error occurred',
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        if (error instanceof HttpException) {
          const status = error.getStatus();
          return throwError(
            () =>
              new HttpException(
                { ...errorResponse, error: error.getResponse() },
                status,
              ),
          );
        }

        return throwError(
          () =>
            new HttpException(
              { ...errorResponse, error: 'Internal Server Error' },
              500,
            ),
        );
      }),
    );
  }
}
