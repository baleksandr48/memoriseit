import React from "react";
import { DeepPartial } from "../../../utils/types";
import { AppState } from "../../../store";
import { BaseLayout } from "../../../components";
import { TopicTabs } from "../../../components/topic/topic-tabs";
import { useSelector } from "react-redux";
import { TopicApi } from "../../../api/topic-api";
import { getPrivatePageProps } from "../../../utils/get-server-side-props";

const TopicPage: React.FunctionComponent<Props> = ({ topicId }) => {
  const {
    topicReducer: { topics },
    authReducer: { currentUser }
  } = useSelector((appState: AppState) => appState);
  const topic = topics.find(({ id }) => id === topicId);
  if (!topic) {
    return null;
  }
  return (
    <BaseLayout title="Contributed topics">
      <TopicTabs topic={topic} currentUserEmail={currentUser!.email} />
    </BaseLayout>
  );
};

interface Props {
  initialReduxState: DeepPartial<AppState>;
  topicId: number;
}

interface Params {
  topicId: string;
}

export const getServerSideProps = getPrivatePageProps<Props, Params>(
  async (params, amplifyInstance, currentUser) => {
    TopicApi.setAmplifyInstance(amplifyInstance);
    const topic = await TopicApi.getTopicPage(params.topicId);
    const initialReduxState: DeepPartial<AppState> = {};
    initialReduxState.authReducer = {
      currentUser
    };
    initialReduxState.topicReducer = {
      topics: [topic]
    };
    return {
      props: {
        initialReduxState,
        topicId: parseInt(params.topicId)
      }
    };
  }
);

export default TopicPage;
