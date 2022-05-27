import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EditCarDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsNotEmpty()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    model?: string;

    @IsString()
    @IsOptional()
    category?: string;
}