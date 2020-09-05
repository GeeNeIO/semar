import { Controller, Get, Put, Delete } from '@nestjs/common';

@Controller('correspondence')
export class CorrespondenceController {
  @Get(':correspondentId')
  find() {

  }

  @Put(':correspondentId')
  update() {

  }

  @Delete(':correspondentId')
  delete() {

  }
}
