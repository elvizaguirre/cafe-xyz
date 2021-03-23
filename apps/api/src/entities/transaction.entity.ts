import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Product as ProductBase } from '@cafe-xyz/data';



@Entity('transactions')
export class Transaction {
    @ApiProperty({ example: 99 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'XKW8547-88999' })
    @Column({ type: 'varchar', length: 255, nullable: false})
    number: string;

    @ApiProperty({ example: '19.58' })
    @Column({ type: 'float', nullable: false})
    amount: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp'})
    createdAt: Date;
}