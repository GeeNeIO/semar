import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateEdcRequestDto, CreateEdcResponseDto, DeleteEdcResponseDto, GetEdcResponseDto, ListEdcRequestDto, ListEdcResponseDto, UpdateEdcRequestDto } from './dto/edc.dto';
import { EdcService } from './edc.service';

@Controller('edc')
export class EdcController {
  constructor(
    private readonly edcService: EdcService,
  ) { }

  @Post()
  create(
    @Body() data: CreateEdcRequestDto
  ): Observable<CreateEdcResponseDto> {
    return of(null);
  }

  @Put(':edcId')
  update(
    @Param('edcId') edcId: string,
    @Body() data: UpdateEdcRequestDto,
  ): Observable<UpdateEdcRequestDto> {
    return of(null);
  }

  @Get(':edcId')
  get(
    @Param('edcId') edcId: string,
  ): Observable<GetEdcResponseDto> {
    return of(null);
  }

  @Get()
  list(
    @Query() query: ListEdcRequestDto,
  ): Observable<ListEdcResponseDto> {
    return of(null);
  }

  @Delete(':edcId')
  delete(
    @Param('edcId') edcId: string,
  ): Observable<DeleteEdcResponseDto> {
    return of(null);
  }
}
