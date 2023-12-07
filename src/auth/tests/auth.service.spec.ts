import { Repository, SelectQueryBuilder } from "typeorm";
import { getRepositoryToken } from '@nestjs/typeorm';
import { UtilService } from '../../../src/@common';
import { JWTService } from '../../../src/@services/jwt';
import { UsersEntity } from '../../../src/@models';
import { AuthService } from '../services/auth.service';
import { BcryptService } from '../../../src/@services/bcrypt/bcrypt.service';
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, InternalServerErrorException } from "@nestjs/common";

describe('AuthService', () => {
    let repository: Repository<UsersEntity>;
    let bcryptService: BcryptService;
    let authService: AuthService;

    const data = {
        name: 'rudianto',
        email: 'test@testemail.com',
        username: 'username',
        password: '12345',
        phone: '4445567',
        pushToken: null,
        isPasswordChanged: false,
        id: '1221212',
        roles: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        beforeInsert: null,
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AbortController],
            providers: [
                AuthService,
                UtilService,
                JWTService,
                BcryptService,
                {
                    provide: getRepositoryToken(UsersEntity),
                    useValue: {
                        save: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        createQueryBuilder: jest.fn(
                            () =>
                                ({
                                    where: jest.fn().mockReturnThis(),
                                    andWhere: jest.fn().mockReturnThis(),
                                    orWhere: jest.fn().mockReturnThis(),
                                    select: jest.fn().mockReturnThis(),
                                    getOne: jest.fn().mockReturnValueOnce(data), // Contoh pengembalian nilai ketika getOne dipanggil
                                    execute: jest
                                        .fn()
                                        .mockResolvedValueOnce([data]), // Contoh pengembalian nilai ketika execute dipanggil
                                    // loggedUser: jest.fn().mockReturnValue(data)
                                }) as unknown as SelectQueryBuilder<UsersEntity>,
                        ),
                    }
                }
            ]
        }).compile();

        repository = module.get<Repository<UsersEntity>>(
            getRepositoryToken(UsersEntity),
        );
        bcryptService = module.get<BcryptService>(BcryptService);
        authService = module.get<AuthService>(AuthService);
    })

    it('should be defined service', () => {
        expect(authService).toBeDefined();
    })

    it('Should can be register user', async () => {
        jest.spyOn(repository, 'findOne').mockReturnValue(null)
        jest.spyOn(repository, 'create').mockReturnValue(data)
        jest.spyOn(repository, 'save').mockResolvedValue(data)

        const result = await authService.register(data)
        // Perform assertions on the result
        expect(result).toHaveProperty('status', true);
        expect(result).toHaveProperty('message', 'Success save user');
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('user');
        expect(result.data.user).toEqual(data);
    })

    it('Should can failed be register user due to email already taken', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(data)
        jest.spyOn(repository, 'create').mockReturnValue(data)
        jest.spyOn(repository, 'save').mockResolvedValue(data)

        // Act & Assert
        await expect(authService.register(data)).rejects.toThrow(BadRequestException);
        // Perform assertions on the result
        // expect(result).toHaveProperty('status', false);
        // expect(result).toHaveProperty('message', 'Email already taken');
        // expect(result).toHaveProperty('data');
        // expect(result.data).toEqual(null);
    })

    it('Should can failed be register user due to username already taken', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null)
        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(data)
        jest.spyOn(repository, 'create').mockReturnValue(data)
        jest.spyOn(repository, 'save').mockResolvedValue(data)

        // Act & Assert
        await expect(authService.register(data)).rejects.toThrow(BadRequestException);
    })

    it('Should can failed be register user due to phone already taken', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null)
        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null)
        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(data)
        jest.spyOn(repository, 'create').mockReturnValue(data)
        jest.spyOn(repository, 'save').mockResolvedValue(data)

        // Act & Assert
        await expect(authService.register(data)).rejects.toThrow(BadRequestException);
    })

    it('Should can failed be register user due to else error', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)
        jest.spyOn(repository, 'create').mockReturnValue(data)
        jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error())

        // Act & Assert
        await expect(authService.register(data)).rejects.toThrow(InternalServerErrorException);
    })

    it('should return true for validate user', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(data)
        const result = await authService.validateUser(data)
        expect(result).toBeTruthy()
    });

    it('should return false for validate user', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(null)
        const result = await authService.validateUser(null)
        expect(result).toBeFalsy()
    });

    it('Return failed login user', async () => {
        const spyCreateQueryBuilder = jest
            .spyOn(repository, 'createQueryBuilder')
            .mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orWhere: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockReturnValueOnce(null), // Contoh pengembalian nilai ketika getOne dipanggil
                execute: jest
                    .fn()
                    .mockResolvedValueOnce([data]),
            } as unknown as SelectQueryBuilder<UsersEntity>);

        await expect(authService.login({ identifier: "test@test.com", password: "asd123" })).rejects.toThrow(BadRequestException)
    })

    it('Return failed login user', async () => {
        jest.spyOn(bcryptService, 'checkPassword').mockResolvedValue(false)

        await expect(authService.login({ identifier: "test@test.com", password: "asd123" })).rejects.toThrow(BadRequestException)
    })

})