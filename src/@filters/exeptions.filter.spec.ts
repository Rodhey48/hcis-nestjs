import { AppExceptionsFilter } from './exeptions.filter'; // Update the path accordingly
import { ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';
import { Response } from 'express';
import { mock, instance, when, anything } from 'ts-mockito';

describe('AppExceptionsFilter', () => {
    let appExceptionsFilter: AppExceptionsFilter;

    beforeEach(() => {
        appExceptionsFilter = new AppExceptionsFilter();
    });

    it('should handle HttpException and return proper response', () => {
        const mockArgumentsHost = mock<ArgumentsHost>();
        const mockResponse = mock<Response>();

        when(mockResponse.status(anything())).thenReturn(instance(mockResponse));
        when(mockResponse.json(anything())).thenReturn(instance(mockResponse));

        when(mockArgumentsHost.switchToHttp()).thenReturn({
            getResponse: () => instance(mockResponse),
        } as any);

        const mockHttpException = new HttpException(
            { message: 'Custom error message' },
            HttpStatus.BAD_REQUEST,
        );

        appExceptionsFilter.catch(mockHttpException, instance(mockArgumentsHost));

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: false,
            code: HttpStatus.BAD_REQUEST,
            message: 'Custom error message',
        });
    });

    it('should handle HttpException and return proper response', () => {
        const mockArgumentsHost = {} as ArgumentsHost;
        const mockResponse = {} as Response;

        jest.spyOn(mockResponse, 'status').mockReturnThis();
        jest.spyOn(mockResponse, 'json').mockReturnThis();

        const mockHttpException = new HttpException(
            { message: 'Custom error message' },
            HttpStatus.BAD_REQUEST,
        );

        appExceptionsFilter.catch(mockHttpException, mockArgumentsHost as any);

        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith({
            status: false,
            code: HttpStatus.BAD_REQUEST,
            message: 'Custom error message',
        });
    });


    // it('should handle non-HttpException and return internal server error response', () => {
    //     const mockArgumentsHost = mock<ArgumentsHost>();
    //     const mockResponse = mock<Response>();

    //     when(mockResponse.status(anything())).thenReturn(instance(mockResponse));
    //     when(mockResponse.json(anything())).thenReturn(instance(mockResponse));

    //     when(mockArgumentsHost.switchToHttp()).thenReturn({
    //         getResponse: () => instance(mockResponse),
    //     } as any);


    //     const mockError = new Error('Some unexpected error');

    //     appExceptionsFilter.catch(mockError, instance(mockArgumentsHost));

    //     expect(mockResponse.status).toHaveBeenCalledWith(
    //         HttpStatus.INTERNAL_SERVER_ERROR,
    //     );
    //     expect(mockResponse.json).toHaveBeenCalledWith({
    //         status: false,
    //         code: HttpStatus.INTERNAL_SERVER_ERROR,
    //         message: ['Internal Server Error'],
    //     });
    // });
});
