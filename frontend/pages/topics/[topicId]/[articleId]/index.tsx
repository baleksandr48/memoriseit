import React from "react";
import { BaseLayout } from "../../../../components";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { ArticleItem } from "../../../../components/common/article-item";
import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import Sidebar from "../../../../components/common/sidebar";
import { DeepPartial } from "../../../../utils/types";
import { resetServerContext } from "react-beautiful-dnd";
import { ArticleTests } from "../../../../components/common/article/article-tests";
import { getPrivatePageProps } from "../../../../utils/get-server-side-props";
import { ArticleApi } from "../../../../api/article-api";
import { LayoutWithSidebar } from "../../../../components/layouts/layout-with-sidebar";

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
      padding: theme.spacing(2)
    }
  })
);

const ViewArticlePage: React.FunctionComponent<Props> = () => {
  const classes = useStyles();
  const {
    articleReducer: {
      articles: [article]
    }
  } = useSelector((store: AppState) => store);
  return (
    <LayoutWithSidebar title="Topic page" sidebar={<Sidebar />}>
      <ArticleItem article={article} />
      <ArticleTests />
    </LayoutWithSidebar>
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
    const { topic, tests, article } = await ArticleApi.getArticlePage(
      params.topicId,
      params.articleId
    );
    const initialReduxState: DeepPartial<AppState> = {};
    initialReduxState.authReducer = {
      currentUser
    };
    initialReduxState.articleReducer = {
      articles: [article]
    };
    initialReduxState.testReducer = {
      tests
    };
    initialReduxState.topicReducer = {
      topics: [topic]
    };
    return {
      props: {
        initialReduxState
      }
    };
  }
);
export default ViewArticlePage;
