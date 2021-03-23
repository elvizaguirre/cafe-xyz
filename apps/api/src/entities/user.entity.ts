import { ApiProperty } from "@nestjs/swagger";
import { hash } from "bcryptjs";
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from "typeorm";
import { User as UserBase } from '@cafe-xyz/data';
import { Cart as CartEntity } from './cart.entity';



@Entity('users')
export class User implements UserBase{
    @ApiProperty({ example: 99 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Juan' })
    @Column({ type: 'varchar', length: 255, nullable: true})
    name: string;

    @ApiProperty({ example: 'Gomez' })
    @Column({ name: 'last_name', type: "varchar", length: 255, nullable: true})
    lastName: string;

    @ApiProperty({ example: 'juan@local.host' })
    @Column({ type: 'varchar', length: 255, nullable: false})
    email: string;

    @ApiProperty({ example: 'SFAsfvsdbgb', minLength: 8, type: 'string', required: true })
    @Column({ type: 'varchar', length: 128, nullable: false, select: false })
    password: string;
        
    @ApiProperty({ title: 'List of orders' })
    @OneToMany( _ => CartEntity, other => other.user )
    carts: CartEntity[];


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return;
        }
        this.password = await hash(this.password, 10);
    }
}