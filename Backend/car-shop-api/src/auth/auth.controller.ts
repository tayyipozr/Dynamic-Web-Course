import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, LoginDto } from "./dto";
import { GetUser, Public } from "./decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('signup')
    signup(@Body() dto: AuthDto): Promise<{ access_token: String }> {
        return this.authService.signup(dto);
    }

    @Public()
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: LoginDto): Promise<{ access_token: String }> {
        return this.authService.signin(dto);
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    signout(@GetUser('id', ParseIntPipe) userId: number) {
        return this.authService.signout(userId);
    }
}