import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CarDto, EditCarDto } from './dto';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CarService {

    constructor(private readonly prisma: PrismaService) { }

    async getAll() {
        return await this.prisma.car.findMany();
    }

    async getCarsByCategories(dto: CategoryDto) {
        console.log(dto);
        console.log("Here");
        return await this.prisma.car.findMany({ where: { category: dto.category } });
    }

    async createCar(userId: number, dto: CarDto) {
        return await this.prisma.car.create({ data: { ...dto, userId } });
    }

    async editCarById(carId: number, dto: EditCarDto) {
        // get the car by id
        const car = await this.prisma.car.findUnique({ where: { id: carId } });

        return this.prisma.car.update({
            where: { id: carId },
            data: { ...dto }
        });
    }

    async deleteCarById(carId: number) {
        // get the car by id
        const car = await this.prisma.car.findUnique({ where: { id: carId } });

        if (!car)
            throw new ForbiddenException('Access to resource denied');

        await this.prisma.car.delete({ where: { id: carId } });
    }

    async getCarCategories(dto: CategoryDto) {
        var categories = [];
        var categoriess = await this.prisma.car.findMany().then(cars => {
            return cars.map(car => {
                console.log(car.category);
                var found = categories.find(c => c === car.category);
                console.log(found);
                if (found == undefined) {
                    categories.push(car.category);
                    return car.category;
                }
            });
        });
        console.log(categoriess);
        return categoriess;
    }

    async search(key: string) {
        const cars = await this.prisma.car.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: key
                        },
                    }, {
                        model: {
                            contains: key
                        },
                    },
                    {
                        category: {
                            contains: key
                        },
                    },
                    {
                        description: {
                            contains: key
                        },
                    },
                ],
            }
        });

        return cars;
    }
}
