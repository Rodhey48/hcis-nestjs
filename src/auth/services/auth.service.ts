import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { RegisterUserDTO } from "../dto/auth.dto";
import { UsersEntity } from "../../@models";
import { UtilService } from "../../@common/helpers/util.service";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(UsersEntity) private userRepo: Repository<UsersEntity>,
        private readonly utilService: UtilService,
    ) { }

    async register(payload: RegisterUserDTO) {
        payload.email = payload.email.trim().toLocaleLowerCase();
        if(!this.utilService.validEmail(payload.email)) {
            throw new BadRequestException({ message: "Format email is not valid"})
        }
        payload.phone = payload.phone.trim().toLocaleLowerCase();
        if(!this.utilService.verifyPhoneNumber(payload.phone)) {
            throw new BadRequestException({ message: "Format phone is not valid"})
        }
        const emailAlreadyUsed = await this.userRepo.findOne({
            where: {
                email: payload.email
            }
        })
        if (emailAlreadyUsed) {
            throw new BadRequestException({ message: "Email already taken", code: 400 })
        }

        payload.email = payload.email.trim().toLocaleLowerCase();
        const usernameAlreadyUsed = await this.userRepo.findOne({
            where: {
                username: payload.username
            }
        })
        if (usernameAlreadyUsed) {
            throw new BadRequestException({ message: "Username already taken", code: 400 })
        }
        payload.email = payload.email.trim().toLocaleLowerCase();
        const phoneAlreadyUsed = await this.userRepo.findOne({
            where: {
                phone: payload.phone
            }
        })
        if (phoneAlreadyUsed) {
            throw new BadRequestException({ message: "Phone already taken", code: 400 })
        }

        try {

            const user = this.userRepo.create(payload);
            await this.userRepo.save(user);
            return {
                status: true,
                message: "Success save user"
            }
        } catch (err) {
            this.logger.error(`Failed save user due to ${err}`);
            throw new InternalServerErrorException("Telah terjadi gangguan pada server kami, silahkan coba beberapa saat kembali")
        }
    }
}