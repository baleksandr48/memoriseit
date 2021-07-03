import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getValueFromPayload } from '../utils/get-value-from-payload';
import { User } from '../models/user.model';

@Injectable()
export class UserAuthorizedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    return !!getValueFromPayload<User>(context, 'currentUser');
  }
}
