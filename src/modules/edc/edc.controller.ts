import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { EdcService } from './edc.service';
import { Edc } from './types/edc.types';
import Big from 'big.js';
import { map } from 'rxjs/operators';
import * as qs from 'querystring';
import { CreateEdcRequest, CreateEdcResponse, DeleteEdcResponse, GetEdcResponse, ListEdcRequest, ListEdcResponse, UpdateEdcRequest, UpdateEdcResponse } from './dto/edc.dto';
import { EdcDataRequestValidator, ListEdcRequestValidator } from './pipes/request.pipe';
import * as R from 'ramda';

function convertEdcToEdcResponseDto(
  edc: Edc,
  balance: number,
): GetEdcResponse {
  return {
    ...edc,
    fee: {
      mdrOnUs: (new Big(edc.fee.mdrOnUs)).div(100).toNumber(),
      mdrOffUs: (new Big(edc.fee.mdrOffUs)).div(100).toNumber(),
    },
    balance,
  };
}

function createQuery(
  prefix: string,
  query: ListEdcRequest,
  totalRows: number,
  isNext: boolean,
): string {
  const currentOffset = query.offset || 0;
  const limit = query.limit || 25;
  const nextOffset = currentOffset + ((!isNext ? -1 : 1) * limit);
  
  if(nextOffset < 0 || nextOffset >= totalRows) {
    return '';
  }

  console.log(`createQuery: `, {
    offset: nextOffset,
    limit: limit,
    merchantName: query.merchantName || '',
    serialNumber: query.serialNumber || '',
    issuer: query.issuer || '',
    ordering: query.ordering || [],
  });
  const q = qs.encode(R.pickBy((val) => (
    (Array.isArray(val) && val.length > 0) 
    || (isNaN(val) && val !== undefined)
    || val !== undefined
  ), {
    offset: nextOffset,
    limit: limit,
    merchantName: query.merchantName,
    serialNumber: query.serialNumber,
    issuer: query.issuer,
    ordering: query.ordering || [],
  }));

  return q.length > 0 ? prefix + '?' + q : '';
}

@Controller('edc')
export class EdcController {
  constructor(
    private readonly edcService: EdcService,
  ) { }

  @Post()
  create(
    @Body(new EdcDataRequestValidator()) data: CreateEdcRequest
  ): Observable<CreateEdcResponse> {
    return this.edcService.create(data).pipe(
      map((edc) => convertEdcToEdcResponseDto(edc, 0)),
    );
  }

  @Put(':edcId')
  update(
    @Param('edcId') edcId: string,
    @Body(new EdcDataRequestValidator()) data: UpdateEdcRequest,
  ): Observable<UpdateEdcResponse> {
    return this.edcService.update(edcId, data).pipe(
      map((edc: Edc) => convertEdcToEdcResponseDto(edc, 0)),
    );
  }

  @Get(':edcId')
  get(
    @Param('edcId') edcId: string,
  ): Observable<GetEdcResponse> {
    return this.edcService.get(edcId).pipe(
      map((edc: Edc) => convertEdcToEdcResponseDto(edc, 0)),
    );
  }

  @Get()
  list(
    @Query(new ListEdcRequestValidator()) query: ListEdcRequest,
  ): Observable<ListEdcResponse> {
    return forkJoin(
      this.edcService.totalRows(query),
      this.edcService.list(query),
    ).pipe(
      map(([totalRows, results]): ListEdcResponse => ({
        count: totalRows,
        next: `${createQuery('edc', query, totalRows, true)}`,
        prev: `${createQuery('edc', query, totalRows, false)}`,
        results: results.map((r) => convertEdcToEdcResponseDto(r, 0)),
      })),
    );
  }

  @Delete(':edcId')
  delete(
    @Param('edcId') edcId: string,
  ): Observable<DeleteEdcResponse> {
    return this.edcService.delete(edcId).pipe(
      map((edc: Edc) => convertEdcToEdcResponseDto(edc, 0)),
    )
  }
}
