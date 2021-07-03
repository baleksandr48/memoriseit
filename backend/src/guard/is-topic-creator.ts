import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CONTRIBUTOR_TYPE } from '../constants';
import { getValueFromPayload } from '../utils/get-value-from-payload';
import { User } from '../models/user.model';
import { Topic } from '../models/topic.model';

@Injectable()
export class IsTopicCreatorGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const currentUser = getValueFromPayload<User>(context, 'currentUser');
    const topic = getValueFromPayload<Topic>(context, 'topic');
    if (!currentUser || !topic) {
      return false;
    }
    return currentUser.contributes!.some(
      contribute =>
        contribute.topicId === topic.id &&
        contribute.type === CONTRIBUTOR_TYPE.CREATOR,
    );
  }
}
