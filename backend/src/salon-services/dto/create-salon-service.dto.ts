import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsArray,
    IsOptional,
    IsBoolean,
    Min,
    IsUrl,
    ValidateIf
} from 'class-validator';

import { Type } from 'class-transformer';


export class CreateSalonServiceDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    category!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    duration!: number;

    @IsOptional()
    @ValidateIf((object, value) => value !== '')
    @IsUrl()
    image?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}