import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTService {
    constructor() { }

    /**
     * create token
     * @param payload
     * @param expiresIn
     * @returns
     */
    createToken(payload: any, expiresIn: string = '7d') {
        const secretOrKey = process.env.JWT_KEY || "secret";
        const token = jwt.sign(payload, secretOrKey, { expiresIn });
        return token;
    }

    /**
     *  verify token
     * @param token
     * @returns
     */
    verifyToken(token: string) {
        const secretOrKey = process.env.JWT_KEY || "secret";
        return jwt.verify(token, secretOrKey);
    }
}
