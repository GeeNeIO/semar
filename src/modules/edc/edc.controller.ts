import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { CreateEdcRequestDto, CreateEdcResponseDto, DeleteEdcResponseDto, GetEdcRequestDto, GetEdcResponseDto, ListEdcRequestDto, ListEdcResponseDto, UpdateEdcRequestDto, UpdateEdcResponseDto } from './dto/edc.dto';
import { EdcService } from './edc.service';
import { Edc } from './types/edc.types';
import Big from 'big.js';
import { map } from 'rxjs/operators';
import * as qs from 'querystring';

function convertEdcToEdcResponseDto(
  edc: Edc,
  balance: number,
): GetEdcResponseDto {
  return {
    edcId: edc.edcId,
    serialNumber: edc.serialNumber,
    merchantName: edc.merchantName,
    issuer: edc.issuer,
    fee: {
      mdrOnUs: (new Big(edc.fee.mdrOnUs)).div(100).toNumber(),
      mdrOffUs: (new Big(edc.fee.mdrOffUs)).div(100).toNumber(),
    },
    settlementAccount: edc.settlementAccount,
    balance: balance,
  };
}

function createQuery(
  query: ListEdcRequestDto,
  totalRows: number,
  isNext: boolean,
): string {
  const currentOffset = query.offset || 0;
  const limit = query.limit || 25;
  const nextOffset = currentOffset + ((!isNext ? -1 : 1) * limit);
  
  if(nextOffset < 0 || nextOffset >= totalRows) {
    return '';
  }

  return qs.encode({
    offset: nextOffset,
    limit: limit,
    merchantName: query.merchantName || '',
    serialNumber: query.serialNumber || '',
    issuer: query.issuer || '',
    ordering: query.ordering || []
  });
}

@Controller('edc')
export class EdcController {
  constructor(
    private readonly edcService: EdcService,
  ) { }

  @Post()
  create(
    @Body() data: CreateEdcRequestDto
  ): Observable<CreateEdcResponseDto> {
    return this.edcService.create(data).pipe(
      map((edc: Edc): CreateEdcResponseDto => convertEdcToEdcResponseDto(edc, 0)),
    );
  }

  @Put(':edcId')
  update(
    @Param('edcId') edcId: string,
    @Body() data: UpdateEdcRequestDto,
  ): Observable<UpdateEdcRequestDto> {
    return this.edcService.update(edcId, data).pipe(
      map((edc: Edc): UpdateEdcResponseDto => convertEdcToEdcResponseDto(edc, 0)),
    );
  }

  @Get(':edcId')
  get(
    @Param('edcId') edcId: string,
  ): Observable<GetEdcResponseDto> {
    return this.edcService.get(edcId).pipe(
      map((edc: Edc): GetEdcResponseDto => convertEdcToEdcResponseDto(edc, 0)),
    );
  }

  @Get()
  list(
    @Query() query: ListEdcRequestDto,
  ): Observable<ListEdcResponseDto> {
    return forkJoin(
      this.edcService.totalRows(query),
      this.edcService.list(query),
    ).pipe(
      map(([totalRows, results]): ListEdcResponseDto => ({
        count: totalRows,
        next: createQuery(query, totalRows, true),
        prev: createQuery(query, totalRows, false),
        results: results.map((r) => convertEdcToEdcResponseDto(r, 0)),
      })),
    );
  }

  @Delete(':edcId')
  delete(
    @Param('edcId') edcId: string,
  ): Observable<DeleteEdcResponseDto> {
    return this.edcService.delete(edcId).pipe(
      map((edc: Edc): DeleteEdcResponseDto => convertEdcToEdcResponseDto(edc, 0)),
    )
  }
}
