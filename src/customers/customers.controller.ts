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

  @Post(':userId/correspondence')
  correspondentCreate() {

  }

  @Put(':userId/correspondence/:correspondentId')
  correspondentUpdate() {

  }

  @Delete(':userId/correnpondence/:correspondentId')
  correspondentDelete() {

  }
}
