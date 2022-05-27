import { ForbiddenException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AuthDto, LoginDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService) { }

    async signup(dto: AuthDto): Promise<{ access_token: String }> {
        try {

            const hash = await bcrypt.hash(dto.password, 12);
            const type = dto.type === 'admin' ? 'ADMIN' : 'USER';
            const user = await this.prisma.user.create({
                data: { email: dto.email, hash, type, firstName: dto.firstName, lastName: dto.lastName }
            });

            const token = await this.getToken(user.id, user.email, user.type);
            return token;

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('User already exists');
                }
            }
            throw error;
        }

    }

    async signin(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user)
            throw new ForbiddenException('User not found');


        const valid = await bcrypt.compare(dto.password, user.hash);

        if (!valid)
            throw new ForbiddenException('Invalid password');


        const tokens = await this.getToken(user.id, user.email, user.type);
        return tokens;
    }

    async signout(userId: number) {
        await this.prisma.user.updateMany({
            where: { id: userId, hash: { not: null } },
            data: { hash: null },
        });
    }

    async getToken(userId: number, email: string, type: string): Promise<{ access_token: String }> {
        const payload = { sub: userId, email, type };
        const secretAt = this.config.get('JWT_AT_SECRET');
        const at = await this.jwt.signAsync(payload, { expiresIn: '15m', algorithm: 'HS256', secret: secretAt });

        return { access_token: at };
    }
}