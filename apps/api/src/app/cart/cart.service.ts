import { CreateCartDto } from "@cafe-xyz/data";
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cart } from "../../entities/cart.entity";
import { Order } from "../../entities/order.entity";
import { Transaction } from "../../entities/transaction.entity";
import { User } from "../../entities/user.entity";

@Injectable()
export class CartService {
    
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>
    ) {}

    /**
     * Gets the full list of orders of a user. 
     * @param user The user owner
     */
    async getMany(user: User) {
        const [data] = await this.cartRepository.findAndCount({where: {user: user}});
        return data;
    }

    /**
     * Gets a shopping list (a cart) by ID
     * @param id The cart ID
     */
    async getOne(id: number) {
        return await this.cartRepository.findOne(id);
    }

    /**
     * Saves a shopping list for a user
     * @param dto The @type CreateCartDto used to save the shopping list
     * @param user The user owner
     */
    async createOne(dto: CreateCartDto, user: User) {
        const orders: Order[] = [];
        const newCart = this.cartRepository.create();
        // create the list of orders asigned to the cart.
        for (const order of dto.content) {
            const element = this.orderRepository.create(order);
            element.cart = newCart;
            orders.push(element);
        }
        // asign the list of orders
        newCart.content = orders;
        // save all and return
        await this.orderRepository.save(orders);
        return await this.cartRepository.save(newCart);
    }

    /**
     * Edit a shopping list (a cart), fails if is already payed.
     * @param id The ID of the shopping list (the cart) to be edited.
     * @param dto The CreateCartDto edited cart.
     * @throws UnauthorizedException if is already payed.
     * @throws NotFoundException if the cart does not exists.
     */
    async editOne(id: number, dto: CreateCartDto) {
        const cart = await this.getOne(id);
        if(!cart) {
            throw new NotFoundException('The cart does not exists');
        }
        if(cart.cheked) { 
            throw new UnauthorizedException('Not allowed to edit a payed cart');
        }
        // Create a new cart from the DTO
        const editedCart = this.cartRepository.create({id, ...dto});
        // save and return
        return await this.cartRepository.save(editedCart);
    }

    /**
     * Confirm the payment of a shopping list (a cart) by ID and creates the transaction record.
     * @param id The ID of the cart
     * @param transaction The transaction number
     * @throws NotFoundException if the cart does not exists.
     * @throws UnauthorizedException if is already payed.
     */
    async checkOne(id: number, transaction: Transaction) {
        const cart = await this.getOne(id);
        if(!cart) {
            throw new NotFoundException('The cart does not exists');
        }
        if(cart.cheked) {
            throw new UnauthorizedException('The cart is already payed');
        }
        // mark as payed
        cart.cheked = true;
        const newTransaction =  this.transactionRepository.create(transaction);
        await this.cartRepository.save(cart);
        return await this.transactionRepository.save(newTransaction);
    }

    /**
     * Deletes a shopping list (a cart) and the orders in it.
     * @param id The ID of the cart to boe deleted.
     * @throws UnauthorizedException if is already payed.
     * @throws NotFoundException if the cart does not exists.
     */
    async deleteOne(id: number) {
        const cart = await this.getOne(id);
        if(!cart) {
            throw new NotFoundException('The cart does not exists');
        }
        if(cart.cheked) {
            throw new UnauthorizedException('The cart is already payed');
        }
        return await this.cartRepository.remove(cart);
    }
}