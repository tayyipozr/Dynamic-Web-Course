import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { CartService } from './cart.service';
import { CartDto } from './dto';

@Controller('cart')
export class CartController {

    constructor(private readonly cartService: CartService) { }

    @Get()
    async getCart(@GetUser('id') userId: number) {
        return await this.cartService.getCart(userId);
    }

    @Post()
    async addToCart(@GetUser('id') userId: number, @Body() dto: CartDto) {
        return await this.cartService.addToCart(userId, dto);
    }

    @Delete()
    async removeFromCart(@GetUser('id') userId: number) {
        return await this.cartService.removeFromCart(userId);
    }
}
