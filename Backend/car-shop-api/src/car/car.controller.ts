import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Console } from 'console';
import { GetUser } from 'src/auth/decorator';
import { AtGuard } from 'src/auth/guard';
import { CarService } from './car.service';
import { CarDto, EditCarDto } from './dto';
import { CategoryDto } from './dto/category.dto';

@UseGuards(AtGuard)
@Controller('car')
export class CarController {

    constructor(private readonly carService: CarService) { }

    @Get()
    async getAll() {
        console.log("getAll called");
        return await this.carService.getAll();
    }

    @Get('byCategory')
    async ByCategory(@Body() dto: CategoryDto) {
        console.log("getCarsByCategory called");
        return await this.carService.getCarsByCategories(dto);
    }

    @Get('categories')
    async Categories(@Body() dto: CategoryDto) {
        console.log("getCategories called")
        return await this.carService.getCarCategories(dto);
    }

    @Post()
    async createCar(@GetUser('id') userId: number, @Body() dto: CarDto) {
        return await this.carService.createCar(userId, dto);

    }

    @Patch(':id')
    async editCarById(@Param('id', ParseIntPipe) carId: number, @Body() dto: EditCarDto) {
        return await this.carService.editCarById(carId, dto);

    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteCarById(@Param('id', ParseIntPipe) carId: number) {
        return await this.carService.deleteCarById(carId);
    }

    @Get(':key')
    async search(@Param('key') key: string) {
        console.log("SEARCH");
        console.log(key);
        return await this.carService.search(key);
    }
}
