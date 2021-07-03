import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getValueFromPayload } from '../utils/get-value-from-payload';

export const PayloadValue = (property: string) =>
  createParamDecorator((data, ctx: ExecutionContext) => {
    return getValueFromPayload(ctx, property);
  })();
