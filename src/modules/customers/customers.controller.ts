import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('customers')
export class CustomersController {

  @Get(':userId')
  find() {
  }

  @Get()
  findAll() {

  }

  @Post()
  create() {

  }

  @Put(':userId')
  update() {

  }

  @Delete(':userId')
  delete() {

  }

  @Get(':userId/correspondence')
  correspondentFindAll() {

  }

  @Post(':userId/correspondence')
  correspondentCreate() {

  }
}
