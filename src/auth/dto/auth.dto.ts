import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDTO {
    @IsNotEmpty({ message: "Email can't empty" })
    @ApiProperty({ example: 'test@test.com' })
    email: string;

    @IsNotEmpty({ message: "name can't empty" })
    @ApiProperty({ example: 'albert wene' })
    name: string;

    @IsNotEmpty({ message: "name can't empty" })
    @ApiProperty({ example: 'albert wene' })
    username: string;

    @IsNotEmpty({ message: "phone can't empty" })
    @ApiProperty({ example: '62897777767' })
    phone: string;

    @IsNotEmpty({ message: "password can't empty" })
    @ApiProperty({ example: 'isSecret' })
    password: string;

    @IsNotEmpty({ message: "id role can't empty" })
    @ApiProperty({ example: ["1213 eweewe3232", "23232dwedd-rr"] })
    role: string[];
}

export class LoginUserDTO {
    @IsNotEmpty({ message: "identifier can't empty" })
    @ApiProperty({ example: 'test@test.com || username' })
    identifier: string;

    @IsNotEmpty({ message: "password can't empty" })
    @IsString({ message: 'Password must be string' })
    @ApiProperty({ example: 'isSecret' })
    password: string;
}
