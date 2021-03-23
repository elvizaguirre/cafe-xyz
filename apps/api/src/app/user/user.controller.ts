import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { User } from '../decorators/user.decorator';
import { CreateUserDto, EditUserDto } from '@cafe-xyz/data';
import { UserService } from './user.service';
import { User as UserEntity } from '../../entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    /**
     * Creates a new user.
     * @param dto The CreateUserDto to freate the user from
     */
    @Post('register')
    async publicRegistration(
        @Body() dto: CreateUserDto
    ) {
        const data = await this.userService.createOne(dto);
        return { message: 'User registered', data }
    }

    /**
     * Edits a user
     * @param id The ID of the user to be edited
     * @param dto The request body should contain an EditUserDto
     * @param user The loggued in user
     */
    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id: number,
        @Body() dto: EditUserDto,
        @User() user: UserEntity
    ) {
        if (id !== user.id) {
                throw new UnauthorizedException('Only can edit your own user');
        } 
        const data = await this.userService.editOne(id, dto, user);
        return { message: 'User edited', data};
    }

    /**
     * Deletes a user
     * @param id The ID of the user to delete
     * @param user The loggued in user
     */
    @Auth()
    @Delete(':id')
    async deleteOne(
        @Param('id',ParseIntPipe) id: number,
        @User() user: UserEntity
    ) {
       
        if (id !== user.id) {
                throw new UnauthorizedException('Only can delete your own user');
        }
        const data = await this.userService.deleteOne(id);
        
        return { message: 'User deleted', data};
    }

}
