import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CarDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    category: string;
}