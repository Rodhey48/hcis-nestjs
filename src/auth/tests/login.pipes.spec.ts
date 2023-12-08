import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { LoginValidatePipe } from '../pipes/login.pipes';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';

describe('LoginValidatePipe', () => {
    let loginValidatePipe: LoginValidatePipe;

    beforeEach(() => {
        loginValidatePipe = new LoginValidatePipe();
    });

    it('should throw BadRequestException for incomplete data', async () => {
        const value = {}; // Provide incomplete data
        const metadata: ArgumentMetadata = { type: 'body', metatype: LoginUserDTO };

        await expect(async () => {
            await loginValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for metatype not same', async () => {
        const value = {}; // Provide incomplete data
        const metadata: ArgumentMetadata = { type: 'body', metatype: RegisterUserDTO };

        await expect(async () => {
            await loginValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });

    it('should transform and validate the input data', async () => {
        const value = { identifier: 'user@example.com', password: 'password' };
        const metadata: ArgumentMetadata = { type: 'body', metatype: LoginUserDTO };


        const result = await loginValidatePipe.transform(value, metadata);

        expect(result).toBeDefined();
        expect(result).toHaveProperty('identifier', 'user@example.com');
        expect(result).toHaveProperty('password', 'password');
    });

    it('should throw BadRequestException for validation errors', async () => {
        const value = { identifier: '', password: '' }; // Invalid data
        const metadata: ArgumentMetadata = { type: 'body', metatype: LoginUserDTO };


        await expect(async () => {
            await loginValidatePipe.transform(value, metadata);
        }).rejects.toThrow(BadRequestException);
    });
});
