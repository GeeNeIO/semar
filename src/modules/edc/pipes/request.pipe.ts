import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { EdcData, ListEdcRequest } from '../dto/edc.dto';
import * as R from 'ramda';

export class EdcDataRequestValidator implements PipeTransform {
  transform(value: EdcData, metadata: ArgumentMetadata): EdcData {
    const needed = R.pick([
      'agentId',
      'serialNumber',
      'merchantName',
      'issuer',
      'fee',
      'settlementAccount',
      'limitPerMonth',
    ], value);

    return {
      ...needed,
      fee: {
        mdrOnUs: parseInt(`${value.fee.mdrOnUs * 100}`),
        mdrOffUs: parseInt(`${value.fee.mdrOffUs * 100}`),
      },
    };
  }
}

export class ListEdcRequestValidator implements PipeTransform {
  transform(value: ListEdcRequest, metadata: ArgumentMetadata): ListEdcRequest {
    const needed = R.pick([
      'agentId',
      'merchantName',
      'serialNumber',
      'issuer',
      'ordering',
      'offset',
      'limit',
    ], value);
    return R.pickBy((val) => val !== undefined, {
      ...needed,
      limit: parseInt(`${value.limit || 0}`) || undefined,
      offset: parseInt(`${value.offset || 0}`) || undefined,
      ordering: Array.isArray(value.ordering) ? value.ordering : 
        value.ordering !== undefined ? [value.ordering] : undefined,
    });
  }
}
