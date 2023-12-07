import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UsersEntity } from "../../../src/@models";
import { Repository, SelectQueryBuilder } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UtilService } from "../../../src/@common";
import { JWTService } from "../../../src/@services/jwt";
import { BcryptService } from "../../../src/@services/bcrypt/bcrypt.service";

describe('AuthController', () => {
    let controller: AuthController;
    let repository: Repository<UsersEntity>;
    let bcryptService: BcryptService;
    let authService: AuthService;

    let data = {
        name: "rudianto",
        email: "test@testemail.com",
        username: 'username',
        password: '12345',
        phone: "4445567",
        pushToken: null,
        isPasswordChanged: false,
        id: "1221212",
        roles: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        beforeInsert: null
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService, UtilService, JWTService, BcryptService, {
                provide: getRepositoryToken(UsersEntity),
                useValue: {
                    save: jest.fn(),
                    findOne: jest.fn(),
                    createQueryBuilder: jest.fn(
                        () =>
                        ({
                            where: jest.fn().mockReturnThis(),
                            andWhere: jest.fn().mockReturnThis(),
                            orWhere: jest.fn().mockReturnThis(),
                            select: jest.fn().mockReturnThis(),
                            getOne: jest.fn().mockReturnValueOnce(data),  // Contoh pengembalian nilai ketika getOne dipanggil
                            execute: jest.fn().mockResolvedValue([data]),  // Contoh pengembalian nilai ketika execute dipanggil
                        } as unknown as SelectQueryBuilder<UsersEntity>)
                    ),
                },
            }]
        }).compile();

        controller = module.get<AuthController>(AuthController);
        repository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
        bcryptService = module.get<BcryptService>(BcryptService);
        authService = module.get<AuthService>(AuthService);
        data.password = await bcryptService.createHashPassword('12345');
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it("should return data from the temporary database", async () => {
        const result = await controller.login({ identifier: "username", password: '12345' });

        expect(result).toHaveProperty("status", true);
        expect(result).toHaveProperty("message", 'Login success');
        expect(result).toHaveProperty("data");
        expect(result.data).toHaveProperty("token")
        expect(typeof result.data.token).toBe("string")

    });

    it('should register a new user', async () => {
        // Mock data for registration
        const registrationData = {
            name: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe',
            password: 'password123',
            phone: '1234567890',
        };

        // Mock the behavior of AuthService.register
        jest.spyOn(authService, 'register').mockImplementation(async () => {
            // You can customize the return value based on your implementation
            return { status: true, message: 'Registration success', data: { user: registrationData } };
        });

        // Call the register method on the controller
        const result = await controller.register(registrationData);

        // Perform assertions on the result
        expect(result).toHaveProperty('status', true);
        expect(result).toHaveProperty('message', 'Registration success');
        expect(result).toHaveProperty('data');
        expect(result.data).toHaveProperty('user');
        expect(result.data.user).toEqual(registrationData);
    });
});
