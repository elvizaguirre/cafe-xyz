import { CreateCartDto } from '@cafe-xyz/data';
import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  //  private readonly 
    ) {}

  @Get('products')
  getData() {
    return this.appService.getData();
  }

}
