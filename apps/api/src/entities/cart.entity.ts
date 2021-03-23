import { Cart as CartBase } from '@cafe-xyz/data';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order as OrderEntity } from './order.entity';
import { User as UserEntity } from './user.entity';
import { User } from '@cafe-xyz/data'

@Entity('carts')
export class Cart implements CartBase {

    @ApiProperty({ example: 99 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Accepted payment' })
    @Column({ type: 'boolean',  default: false })
    cheked?: boolean;


    @ManyToOne( _ => UserEntity, other => other.carts )
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
    
    @ApiProperty({ title: 'List of orders' })
    @OneToMany( _ => OrderEntity, other => other.cart, { cascade: ['remove'] } )
    content: OrderEntity[];


}