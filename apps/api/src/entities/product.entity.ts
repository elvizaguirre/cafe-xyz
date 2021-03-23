import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Product as ProductBase } from '@cafe-xyz/data';



@Entity('products')
export class Product implements ProductBase {
    @ApiProperty({ example: 99 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Choco Donouts' })
    @Column({ type: 'varchar', length: 255, nullable: false})
    name: string;

    @ApiProperty({ example: '12.50' })
    @Column({ type: 'float', nullable: false})
    price: number;

    @ApiProperty({ example: '/assets/products/chocoDon.png' })
    @Column({ type: 'varchar', length: 255, nullable: false})
    picture: string;
}