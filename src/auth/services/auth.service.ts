import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';
import { UsersEntity } from '../../@models';
import { UtilService } from '../../@common/helpers/util.service';
import { BcryptService } from '../../@services/bcrypt/bcrypt.service';
import { JWTService } from '../../@services/jwt/jwt.service';
import {
    RequestInterface,
    ResponseInterface,
    UserLoggedInterface,
} from '../../@interfaces';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '../../@common';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(UsersEntity)
        private userRepo: Repository<UsersEntity>,
        private readonly utilService: UtilService,
        private bcryptService: BcryptService,
        private jwtService: JWTService,
    ) { }

    /**
     * register new user
     * @param payload
     * @returns
     */
    async register(payload: RegisterUserDTO): Promise<ResponseInterface> {
        const emailAlreadyUsed = await this.userRepo.findOne({
            where: {
                email: payload.email,
            },
        });
        if (emailAlreadyUsed) {
            const result: ResponseInterface = {
                status: false,
                message: 'Email already taken',
                data: null,
            };
            throw new BadRequestException(result);
        }

        const usernameAlreadyUsed = await this.userRepo.findOne({
            where: {
                username: payload.username,
            },
        });
        if (usernameAlreadyUsed) {
            throw new BadRequestException({
                message: 'Username already taken',
                code: 400,
            });
        }

        const phoneAlreadyUsed = await this.userRepo.findOne({
            where: {
                phone: payload.phone,
            },
        });
        if (phoneAlreadyUsed) {
            throw new BadRequestException({
                message: 'Phone already taken',
                code: 400,
            });
        }

        try {
            const user = this.userRepo.create(payload);
            await this.userRepo.save(user);
            return {
                status: true,
                message: 'Success save user',
                data: { user },
            };
        } catch (err) {
            this.logger.error(`Failed save user due to ${err}`);
            throw new InternalServerErrorException(
                INTERNAL_SERVER_ERROR_MESSAGE,
            );
        }
    }

    /**
     * login user
     * @param payload
     * @return Token
     */

    async login(payload: LoginUserDTO): Promise<ResponseInterface> {
        const foundUser = await this.userRepo
            .createQueryBuilder('user')
            .select()
            .where('user.email = :email', { email: payload.identifier })
            .orWhere('user.username = :username', {
                username: payload.identifier,
            })
            .getOne();

        if (!foundUser) {
            this.logger.error(
                `Failed login user ${payload.identifier} due to data not found`,
            );
            throw new BadRequestException({
                message: 'Email or password not found',
                status: false,
                data: null,
            });
        }

        if (
            !(await this.bcryptService.checkPassword(
                payload.password,
                foundUser.password,
            ))
        ) {
            this.logger.error(
                `Failed login user ${payload.identifier} due to password not same`,
            );
            throw new BadRequestException({
                message: 'Email or password is wrong ',
                status: false,
                data: null,
            });
        }

        const data: UserLoggedInterface = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            username: foundUser.username,
        };

        const token = this.jwtService.createToken(data);

        const result: ResponseInterface = {
            status: true,
            message: 'Login success',
            data: {
                token,
            },
        };
        return result;
    }

    /**
     * User Looged exsist
     * @param req
     */
    async userLogged(req: RequestInterface): Promise<ResponseInterface> {
        const user = await this.userRepo.findOne({
            where: {
                id: req.user.id,
            },
        });
        if (user) {
            delete user.password;
        }
        const result: ResponseInterface = {
            status: user ? true : false,
            message: user ? 'Success login' : "User not found",
            data: user ? { user } : null,
        };

        return result;
    }

    async validateUser(signedUser): Promise<boolean> {
        if (signedUser && signedUser.id) {
            return Boolean(
                await this.userRepo.findOne({
                    where: { id: signedUser.id },
                }),
            );
        } else {
            return false;
        }
    }
}
