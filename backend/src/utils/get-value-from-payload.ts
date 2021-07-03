import * as _ from 'lodash';
import { ExecutionContext } from '@nestjs/common';

export const getValueFromPayload = <Type>(
  context: ExecutionContext,
  property: string,
): Type | null => {
  const request = context.switchToHttp().getRequest();
  return _.get(request, `payload.${property}`, null);
};
