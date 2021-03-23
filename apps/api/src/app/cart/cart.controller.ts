import { CreateCartDto } from '@cafe-xyz/data';
import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { User } from '../decorators/user.decorator';
import { User as UserEntity } from '../../entities/user.entity';
import { CartService } from './cart.service';
import { ParseIntPipe } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { Transaction } from '../../entities/transaction.entity';

@Controller('cart')
export class CartController {

    constructor(
        private readonly cartService: CartService
    ) {}

    /**
     * Gets the list of shopping list (carts) of the logged in user
     */
    @Auth()
    @Get()
    async getMany(
        @User() user: UserEntity
    ) {
        const data = await this.cartService.getMany(user);
        return { data };
    }

    /**
     * Gets a shopping list (a cart) by ID
     * @param id The ID of the cart
     * @param user The user loggued in
     * @throws UnauthorizedException if the loggued in user is not the owner.
     */
    @Auth()
    @Get(':id')
    async getOne(
        @Param('id',ParseIntPipe) id: number,
        @User() user: UserEntity
    ) {
        const data =  await this.cartService.getOne(id)
        if (data.user !== user ) {
            throw new UnauthorizedException('You can only see your own orders');
        }

        return { data };
    }

    /**
     * Creates a new shopping list (cart)
     * @param dto The CreateCartDto object to be created from.
     * @param user The loggued in user
     */
    @Auth()
    @Post()
    async createOne(
        @Body() dto: CreateCartDto,
        @User() user: UserEntity
    ) {
        const data = await this.cartService.createOne(dto, user);
        return { data };
    }

    /**
     * Edits the shopping list (cart) with the given ID
     * @param id The ID of the cart
     * @param dto The modified CreateCartDto cart
     * @param user The loggued in user
     * @throws UnauthorizedException if the user is not the owner.
     */
    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id: number,
        @Body() dto: CreateCartDto,
        @User() user: UserEntity
    ) {
        const cart = await this.cartService.getOne(id);
        if(cart.user !== user) {
            throw new UnauthorizedException('You can only edit your own orders');
        }
        const data = await this.cartService.editOne(id, dto)
        return { data };
    }

    /**
     * Deletes a shopping list (a cart) by ID
     * @param id The id of the cart to delete
     * @param user The loggued in user
     * @throws UnauthorizedException if user is not the owner.
     */
    @Auth()
    @Delete(':id')
    async deleteOne(
        @Param('id',ParseIntPipe) id: number,
        @User() user: UserEntity
    ) {
        const cart = await this.cartService.getOne(id);
        if(cart.user !== user) {
            throw new UnauthorizedException('You can only delete your own orders');
        }
        const data = await this.cartService.deleteOne(id);
        return { data };
    }

    /**
     * Pay a shopping list (cart)
     * @param id The ID of the cart
     * @param card The card number
     * @param user The user loggued in
     */
    @Auth()
    @Post('pay/:id')
    async payOne(
        @Param('id',ParseIntPipe) id: number,
        @Body() card: number,
        @User() user: UserEntity
    ) {
        const cart = await this.cartService.getOne(id);
        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        let amount = 0;
        cart.content.forEach((order) =>{
            amount += order.amount;
        });
        
        const data = await this.paymentApi(card, amount);
        if(!data) {
            throw new ServiceUnavailableException('Can not process the request');
        }

        const transaction = await this.cartService.checkOne(id, data);
        return { 'data': transaction };
    }

    /**
     * Dummy function to emulate a payment API
     * @param card The card number
     * @param amount The price to pay
     */
    async paymentApi(card: number, amount: number) {
        if(card % 2 === 0) {
            return null;
        }
        const number = await hash('Trans', card);
        const transaction = new Transaction();
        transaction.amount = amount;
        transaction.number = number;
        return transaction;
    }
}
