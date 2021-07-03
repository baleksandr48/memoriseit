import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getValueFromPayload } from '../utils/get-value-from-payload';
import { Topic } from '../models/topic.model';
import { User } from '../models/user.model';

@Injectable()
export class IsTopicContributorGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const currentUser = getValueFromPayload<User>(context, 'currentUser');
    const topic = getValueFromPayload<Topic>(context, 'topic');
    if (!currentUser || !topic) {
      return false;
    }
    return currentUser.contributes!.some(
      contribute => contribute.topicId === topic.id,
    );
  }
}
