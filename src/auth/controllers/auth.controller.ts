import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';
import { RequestInterface } from '../../@interfaces';
import { LoggingInterceptor } from '../../@services/interceptions/logging.interceptions';
import { LoginValidatePipe } from '../pipes/login.pipes';
import { RegisterValidatePipe } from '../pipes/register.pipes';
import { UtilService } from '../../@common';
import { JWTAuthGuard } from '../../@services/jwt';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(new LoggingInterceptor())
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('/register')
    @UsePipes(new RegisterValidatePipe(new UtilService()))
    @ApiOperation({ summary: 'For register user' })
    async register(@Body() payload: RegisterUserDTO) {
        return this.service.register(payload);
    }

    @Post('/login')
    @UsePipes(new LoginValidatePipe())
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() body: LoginUserDTO) {
        return this.service.login(body);
    }

    @Get('/logged')
    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard)
    @ApiOperation({ summary: 'Logged use' })
    async loggedUser(@Req() req: RequestInterface) {
        return this.service.userLogged(req);
    }
}
