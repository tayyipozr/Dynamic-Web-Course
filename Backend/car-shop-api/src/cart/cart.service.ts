import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartDto } from './dto';

@Injectable()
export class CartService {

    constructor(private readonly prismaService: PrismaService) { }

    async getCart(userId: number) {
        return await this.prismaService.cart.findMany({ where: { userId }, include: { car: true } });
    }

    async addToCart(userId: number, dto: CartDto) {
        return await this.prismaService.cart.create({ data: { userId, carId: dto.carId } });
    }

    async removeFromCart(userId: number) {
        return await this.prismaService.cart.deleteMany({ where: { userId } });
    }

}
