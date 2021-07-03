import React from "react";
import { BaseLayout } from "../../components";
import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { DeepPartial } from "../../utils/types";
import grey from "@material-ui/core/colors/grey";
import { ContributedTopicList } from "../../components/contributed/topic-list/topic-list.component";
import { useDeleteTopicAction } from "../../store/topic/hook";
import { CreateTopicButton } from "../../components/contributed-topics/create-topic-button";
import { TopicApi } from "../../api/topic-api";
import { getPrivatePageProps } from "../../utils/get-server-side-props";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      borderBottom: "1px solid",
      borderColor: grey["700"],
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: theme.spacing(1),
      alignItems: "flex-end"
    },
    topicItem: {
      padding: theme.spacing(2)
    }
  })
);

interface Props {
  initialReduxState?: DeepPartial<AppState>;
}

const ContributedTopicsPage: React.FunctionComponent<Props> = () => {
  const classes = useStyles();
  const { topics } = useSelector((appState: AppState) => appState.topicReducer);
  const deleteTopic = useDeleteTopicAction();

  return (
    <BaseLayout title="Contributed topics">
      <Box className={classes.header}>
        <Typography variant={"h5"}>Contributed topics</Typography>
        <CreateTopicButton />
      </Box>
      <ContributedTopicList topics={topics} deleteTopic={deleteTopic} />
    </BaseLayout>
  );
};

export const getServerSideProps = getPrivatePageProps<Props>(
  async (params, amplifyInstance, currentUser) => {
    TopicApi.setAmplifyInstance(amplifyInstance);
    const topics = await TopicApi.getContributedTopicsPage();
    const initialReduxState: DeepPartial<AppState> = {};
    initialReduxState.authReducer = {
      currentUser
    };
    initialReduxState.topicReducer = {
      topics
    };
    return {
      props: {
        initialReduxState
      }
    };
  }
);
export default ContributedTopicsPage;
