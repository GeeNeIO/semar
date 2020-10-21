import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { EdcData } from '../dto/edc.dto';

export class EdcDataRequestValidator implements PipeTransform {
  transform(value: EdcData, metadata: ArgumentMetadata): EdcData {
    return {
      ...value,
      fee: {
        mdrOnUs: parseInt(`${value.fee.mdrOnUs * 100}`),
        mdrOffUs: parseInt(`${value.fee.mdrOffUs * 100}`),
      },
    };
  }
}
