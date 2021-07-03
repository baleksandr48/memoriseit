import React from "react";
import { BaseLayout } from "../../../../components";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import { DeepPartial } from "../../../../utils/types";
import { resetServerContext } from "react-beautiful-dnd";
import { TestApi } from "../../../../api/test-api";
import { AddArticleTestItem } from "../../../../components/common/article/add-article-test-item";
import { TestEdit } from "../../../../components/common/tests/edit";
import { getPrivatePageProps } from "../../../../utils/get-server-side-props";
import { ArticleApi } from "../../../../api/article-api";

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
      "& > *": {
        marginTop: theme.spacing(1)
      },
      "& > *:first-child": {
        marginTop: 0
      }
    }
  })
);

const EditArticleTestsPage: React.FunctionComponent<Props> = () => {
  const classes = useStyles();
  const {
    testReducer: { tests }
  } = useSelector((store: AppState) => store);
  return (
    <BaseLayout title="Edit tests">
      <Box className={classes.root}>
        <Box className={classes.mainPart}>
          <Box className={classes.childrenContainer}>
            {tests.map((test, index) => (
              <TestEdit test={test} key={index} />
            ))}
            <AddArticleTestItem />
          </Box>
        </Box>
      </Box>
    </BaseLayout>
  );
};

interface Props {
  initialReduxState: DeepPartial<AppState>;
}

interface Params {
  topicId: string;
  articleId: string;
}

export const getServerSideProps = getPrivatePageProps<Props, Params>(
  async (params, amplifyInstance, currentUser) => {
    resetServerContext();
    ArticleApi.setAmplifyInstance(amplifyInstance);
    const tests = await TestApi.getArticleTests(
      params.topicId,
      params.articleId
    );
    const initialReduxState: DeepPartial<AppState> = {};
    initialReduxState.authReducer = {
      currentUser
    };
    initialReduxState.testReducer = {
      tests
    };
    return {
      props: {
        initialReduxState
      }
    };
  }
);
export default EditArticleTestsPage;
