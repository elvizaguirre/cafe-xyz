import { 
  IsEmail, 
  IsOptional, 
  IsString,
  IsPositive,
  IsArray,
  IsNumber,
  MaxLength, 
  MinLength, 
  ValidateNested,
  IsNotEmpty
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";

export function data(): string {
  return 'data';
}

export interface Book {
  title: string;
  author: string;
  isbn: string;
  cover?: string;
}

export interface User {
  id?: number;
  name?: string;
  lastName?: string;
  email: string;
  password: string;
}

export class CreateUserDto implements User{
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string

}

export class EditUserDto extends PartialType(CreateUserDto) {}


export interface Product {
  id?: number;
  name: string;
  price: number;
  picture: string;
}

export interface Order {
  id?: number;
  product: Product;
  amount: number;
  observation?: string;
}

export class CreateOrderDto implements Order {
  @IsNumber(
    {
      maxDecimalPlaces : 0,
      allowInfinity: false,
      allowNaN: false
    },
    {
      message: 'The parameter should be a valid Product ID.'
    }
  )
  product: Product;

  @IsNumber(
    {
      maxDecimalPlaces : 0,
      allowInfinity: false,
      allowNaN: false
    },
    {
      message: 'The ammount should be a valid int.'
    }
  )
  @IsPositive({ message: 'The ammount shold be at least 1.'})
  amount: number;
  
  @IsOptional()
  @IsString({ message: 'The observation shoul be a valid string'})
  @MaxLength(255, {message: 'The max length is 255'})
  observation?: string;
}

export interface Cart {
  id?: number;
  content: Order[];
  cheked?: boolean;
}

export class CreateCartDto implements Cart {
  @ValidateNested({each: true})
  @IsArray()
  @IsNotEmpty()
  @Type(() => CreateOrderDto)
  content: CreateOrderDto[];
}

