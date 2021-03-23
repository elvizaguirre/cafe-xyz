import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, EditUserDto } from '@cafe-xyz/data';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    /**
     * Gets the full list of users
     */
    async getMany() {
        return await this.userRepository.find();
    }

    /**
     * Gets a User by ID, optionally compares the user with the second parameter. 
     * @param id The ID to search
     * @param userEntity optional User entity to math to
     * @throws NotFoundException if user does not exits or if diferent from userEntity
     */
    async getOne(id: number, userEntity?: User) {
        const user = await this.userRepository.findOne(id)
        .then(u => !userEntity ? u : !!u && userEntity.id === u.id ? u : null)
        if (!user) throw new NotFoundException('User does not exists or unauthorized');
        return user;
    }

    /**
     * Creates a new User and saves it.
     * @param dto The CreateUserDto to create the user from
     * @returns The User entity without the password property.
     */
    async createOne(dto: CreateUserDto) {
        const userExist = await this.userRepository.findOne({ email: dto.email });
        if (userExist) throw new BadRequestException('User already registered with email');
        const newUser = this.userRepository.create(dto);
        const user =  await this.userRepository.save(newUser);
        delete user.password;
        return user;
    }

    /**
     * Edit a user.
     * @param id The ID of the user to edit
     * @param dto The EditUserDto with the edited fields
     * @param userEntity A user to match to
     */
    async editOne(id: number, dto: EditUserDto, userEntity?: User) {
        const user = await this.getOne(id, userEntity);
        const edited = Object.assign(user, dto);
        const saved =  await this.userRepository.save(edited);
        delete saved.password;
        return saved;
    }

    /**
     * Deletes a user.
     * @param id The ID of the user
     * @param userEntity optionally a User to match to
     */
    async deleteOne(id: number, userEntity?: User) {
        const user = await this.getOne(id, userEntity);
        return await this.userRepository.remove(user);
    }

    /**
     * Finds a user by email
     * @param email The email to search the user
     * @returns a User entity with that email or null
     */
    async findByEmail(email: string) {
        return await this.userRepository.
        createQueryBuilder('user')
        .where({ email: email})
        .addSelect('user.password')
        .getOne();
    }
}
