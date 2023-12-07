import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    constructor() { }

    /**
     * Check Password
     *
     * @param password Password, hash Hashed Password
     * @return Promise<boolean>
     */
    checkPassword(
        password: string | undefined,
        hash: string | undefined,
    ): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * create hash password
     * @param planPassword
     * @return Promise<string>
     */

    createHashPassword(planPassword: string): Promise<string> {
        return bcrypt.hash(planPassword, 10);
    }
}
