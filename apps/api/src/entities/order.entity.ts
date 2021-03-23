import { Order as OrderBase } from '@cafe-xyz/data';
import { Cart as CartBase } from '@cafe-xyz/data';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cart as CartEntity } from './cart.entity';
import { Product as ProductEntity } from './product.entity';

@Entity('orders')
export class Order implements OrderBase {
    
    @ApiProperty({ example: 99 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: '3' })
    @Column({ type: 'int', nullable: false, default: 1})
    amount: number;

    @ApiProperty({ example: 'Anything the user want to write' })
    @Column({ type: 'varchar', length: 255, nullable: true })
    observation?: string;
   
    @ApiProperty({ title: 'The ID of the product wanted' })
    @ManyToOne(_ => ProductEntity)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product: ProductEntity

    @ApiProperty({ title: 'The cart'})
    @ManyToOne(_ => CartEntity)
    @JoinColumn({ name: 'cart_id', referencedColumnName: 'id'})
    cart: CartBase;

}