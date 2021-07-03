import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getValueFromPayload } from '../utils/get-value-from-payload';

@Injectable()
export class ContextContainsGuard implements CanActivate {
  constructor(private readonly property: string) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return !!getValueFromPayload(context, this.property);
  }
}
