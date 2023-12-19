import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UtilService } from '../../@common';
import { RegisterValidatePipe } from '../pipes/register.pipes';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';

describe('RegisterValidatePipe', () => {
    let registerValidatePipe: RegisterValidatePipe;
    const utilService = new UtilService();

    beforeEach(() => {
        registerValidatePipe = new RegisterValidatePipe(utilService);
    });
    it('should throw BadRequestException for empty data', async () => {
        const value = {}; // Invalid data
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: RegisterUserDTO,
        };

        await expect(async () => {
            await registerValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for incomplete data', async () => {
        const value = {
            email: '',
            name: '',
            phone: '',
            password: '',
            username: '',
        }; // Invalid data
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: RegisterUserDTO,
        };

        await expect(async () => {
            await registerValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for metatype not same', async () => {
        const value = {}; // Provide incomplete data
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: LoginUserDTO,
        };

        await expect(async () => {
            await registerValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });

    it('should transform and validate the input data', async () => {
        const value = {
            email: 'email@email.com',
            name: 'is Name',
            phone: '6285642298655',
            password: 'isPassword',
            username: 'username',
        };
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: RegisterUserDTO,
        };

        const result = await registerValidatePipe.transform(value, metadata);

        expect(result).toBeDefined();
        expect(result).toHaveProperty('email', 'email@email.com');
        expect(result).toHaveProperty('password', 'isPassword');
        expect(result).toHaveProperty('username', 'username');
        expect(result).toHaveProperty('phone', '6285642298655');
        expect(result).toHaveProperty('name', 'is Name');
    });

    it('should throw BadRequestException for validation format email', async () => {
        const value = {
            email: 'email',
            name: 'is Name',
            phone: '122344',
            password: 'isPassword',
            username: 'username',
        }; // Invalid data
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: RegisterUserDTO,
        };

        await expect(async () => {
            await registerValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for validation format phone', async () => {
        const value = {
            email: 'email@email.com',
            name: 'is Name',
            phone: 're',
            password: 'isPassword',
            username: 'username',
        }; // Invalid data
        const metadata: ArgumentMetadata = {
            type: 'body',
            metatype: RegisterUserDTO,
        };

        await expect(async () => {
            await registerValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });
});
