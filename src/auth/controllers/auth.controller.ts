import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';
import { RequestInterface } from '@interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('/register')
    @ApiOperation({ summary: 'For register user' })
    async register(@Body() payload: RegisterUserDTO) {
        return this.service.register(payload);
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() body: LoginUserDTO) {
        return this.service.login(body);
    }

    @Get('/logged')
    @ApiOperation({ summary: 'Logged use' })
    async loggedUser(@Req() req: RequestInterface) {
        return this.service.userLogged(req);
    }
}
