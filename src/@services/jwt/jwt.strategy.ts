import { Injectable } from "@nestjs/common";

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from "../../auth/services/auth.service";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly service: AuthService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: process.env.JWT_KEY
            },
            async (req, payload, next) => await this.verify(req, payload, next)
        )
    }

    public async verify(req, payload, done) {

        const isValid = await this.service.validateUser(payload);

        if (!isValid) {
            return done('Unauthorized', false);
        }
        done(null, payload);
    }
}