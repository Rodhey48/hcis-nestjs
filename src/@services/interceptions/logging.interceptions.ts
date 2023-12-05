import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// interceotions dipakai untuk membaca request user dan response dari server, bisa digunakan untuk logging,

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // console.log('Before...');
        // const request = context.switchToHttp().getRequest();
        // console.log(request)
        // const now = Date.now();
        return next.handle().pipe(
            tap(() => {
                // console.log(`After... ${Date.now() - now}ms`);
                // const statusCode = context.switchToHttp().getResponse().statusCode;
                // console.log(statusCode)
                // console.log(data)
            }),
        );
    }
}
