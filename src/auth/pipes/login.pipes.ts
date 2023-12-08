import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { LoginUserDTO } from '../dto/auth.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class LoginValidatePipe implements PipeTransform<any> {
    // funsi untuk menvalidate data yang masuk dan diolah sebelum masuk fungsi
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (metatype != LoginUserDTO) {
            throw new BadRequestException('Data is not login type');
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const errMessage = errors
                .map((err) => Object.values(err.constraints).join(', '))
                .join(', ');

            throw new BadRequestException(errMessage);
        }

        object.identifier = value.identifier.trim();
        object.password = value.password.trim();

        return object;
    }
}
