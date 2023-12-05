import { INTERNAL_SERVER_ERROR_MESSAGE } from '../@common/exceptions/exception.constant';
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger('AppExceptions');

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // ini menangkap error yang ada status code nya,
        if (exception instanceof HttpException) {
            const res: any = exception.getResponse();
            const status = exception.getStatus();
            response.status(status).json({
                status: false,
                code: status,
                message: res.message,
            });
            return;
        }

        // ini menangkap error yang gara2  code error atau DB error
        this.logger.error(exception.stack);
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            status: false,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            message: [INTERNAL_SERVER_ERROR_MESSAGE],
        });
    }
}
