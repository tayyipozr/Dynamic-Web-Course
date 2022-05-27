import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guard';
import { PrismaModule } from './prisma/prisma.module';
import { CarModule } from './car/car.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, PrismaModule, CarModule, CartModule],
  providers: [{
    provide: APP_GUARD,
    useClass: AtGuard,
  }],
})
export class AppModule { }
