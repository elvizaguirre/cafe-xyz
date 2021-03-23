import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { User } from '../decorators/user.decorator';
import { User as UserEntity } from '../../entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('APP autentication')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @User() user: UserEntity
    ) {
        const data = await this.authService.login(user)
        return {
            message: 'Login OK',
            data
        };
    }

    @Auth()
    @Get('profile')
    async profile(
        @User() user: UserEntity
    ) {
        return {
            message: 'Correct',
            user
        }
    }

    @Auth()
    @Get('refresh')
    refreshToken(
        @User() user: UserEntity
    ) {
        const data = this.authService.login(user);
        return {
            message: 'Correct refresh',
            data
        }
    }
}
