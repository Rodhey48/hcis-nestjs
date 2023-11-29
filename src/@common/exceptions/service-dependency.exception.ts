import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceDependencyException extends HttpException {
    constructor(message: string | object | any) {
        super(message, HttpStatus.FAILED_DEPENDENCY);
    }
}
