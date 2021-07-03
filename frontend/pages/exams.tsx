import React from "react";
import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import { DeepPartial } from "../utils/types";
import { AppState } from "../store";
import { useSelector } from "react-redux";
import { BaseLayout } from "../components";
import { TopicExams } from "../components/exams/topic-exams";
import { getPrivatePageProps } from "../utils/get-server-side-props";
import { TopicApi } from "../api/topic-api";
import { Topic } from "../store/topic/types";
import { mapTree } from "../utils/tree-utils";
import moment from "moment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
      alignItems: "stretch"
    },
    mainPart: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1
    },
    childrenContainer: {
      maxWidth: 1280,
      alignSelf: "center",
      width: "100%",
      flexGrow: 1,
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.paper
    },
    topicExams: {
      "& > *": {
        marginTop: theme.spacing(2)
      }
    }
  })
);
interface Props {
  initialReduxState?: DeepPartial<AppState>;
}

const ExamsPage: React.FunctionComponent<Props> = () => {
  const classes = useStyles();
  const { topics } = useSelector((appState: AppState) => appState.topicReducer);

  return (
    <BaseLayout title="Contributed topics">
      <Box className={classes.root}>
        <Box className={classes.mainPart}>
          <Box className={classes.childrenContainer}>
            <Box className={classes.topicExams}>
              {topics.map(topic => (
                <TopicExams topic={topic} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </BaseLayout>
  );
};

export const getServerSideProps = getPrivatePageProps<Props>(
  async (params, amplifyInstance, currentUser) => {
    TopicApi.setAmplifyInstance(amplifyInstance);
    // @ts-ignore
    const {
      topics,
      testResults
    }: {
      topics: Topic[];
      testResults: Array<{
        articleId: number;
        updatedAt: string;
        result: number;
      }>;
    } = await TopicApi.getTopicsForExams();
    topics.map(topic => {
      mapTree(topic.tableOfContents, el => {
        const result = testResults.find(
          testResult => testResult.articleId === el.id
        );
        if (result) {
          const interval = moment(new Date(result.updatedAt)).fromNow();
          el.title = `${el.title} (Last time repeated ${interval})`;
        }
        return el;
      });
    });
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
export default ExamsPage;
