import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { RegisterUserDTO } from "../dto/auth.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly service: AuthService
    ){}
    
    @Post('/register')
    @ApiOperation({ summary: "For register user"})
    async register (@Body() payload: RegisterUserDTO) {
        return this.service.register(payload);
    }
}