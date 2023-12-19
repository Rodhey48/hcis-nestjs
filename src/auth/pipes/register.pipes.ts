import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { RegisterUserDTO } from '../dto/auth.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UtilService } from '../../@common';
import { ResponseInterface } from '../../@interfaces';

@Injectable()
export class RegisterValidatePipe implements PipeTransform<RegisterUserDTO> {
    constructor(private readonly utilService: UtilService) {}
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (metatype != RegisterUserDTO) {
            throw new BadRequestException('Data is incomplete');
        }

        const user = plainToClass(metatype, value);
        const errors = await validate(user);
        if (errors.length > 0) {
            const errMessage = errors
                .map((err) => Object.values(err.constraints).join(', '))
                .join(', ');

            throw new BadRequestException(errMessage);
        }

        user.email = user.email.trim().toLocaleLowerCase();

        if (!this.utilService.validEmail(user.email)) {
            const result: ResponseInterface = {
                status: false,
                message: 'Format email is not valid',
                data: null,
            };
            throw new BadRequestException(result);
        }
        user.phone = user.phone.trim().toLocaleLowerCase();

        if (!this.utilService.verifyPhoneNumber(user.phone)) {
            const result: ResponseInterface = {
                status: false,
                message: 'Format Phone is not valid',
                data: null,
            };
            throw new BadRequestException(result);
        }

        return user;
    }
}
