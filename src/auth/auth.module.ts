import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersEntity } from '../@models';
import { UtilService } from '../@common';
import { JWTService } from '../@services/jwt/jwt.service';
import { BcryptService } from '../@services/bcrypt/bcrypt.service';

@Module({
    imports: [TypeOrmModule.forFeature([UsersEntity])],
    controllers: [AuthController],
    providers: [AuthService, UtilService, JWTService, BcryptService],
})
export class AuthModule {}
