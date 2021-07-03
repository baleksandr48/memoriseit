import React from "react";
import { BaseLayout } from "../../../../components";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import _ from "lodash";
import { ArticleApi } from "../../../../api/article-api";
import { DeepPartial } from "../../../../utils/types";
import {
  useEditArticleAction,
  useSaveEditedArticleAction
} from "../../../../store/article/hook";
import { LoaderDialog } from "../../../../components/common/dialogs/loader-dialog";
import { getPrivatePageProps } from "../../../../utils/get-server-side-props";
import Editor from "../../../../components/editor";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { useOpenDialogAction } from "../../../../store/dialog/hook";
import {
  DIALOG_TYPE,
  SIMPLE_DIALOG_TYPE,
  SimpleDialogContext
} from "../../../../store/dialog/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabSave: {
      bottom: theme.spacing(4),
      backgroundColor: "#10bc29"
    },
    fab: {
      right: theme.spacing(2),
      height: 48,
      width: 48,
      color: "white",
      position: "fixed"
    }
  })
);

const EditArticlePage: React.FunctionComponent<Props> = () => {
  const classes = useStyles();
  const { edit } = useSelector((store: AppState) => store.articleReducer);
  const editArticleAction = useEditArticleAction();
  const saveEditedArticleAction = useSaveEditedArticleAction();
  const openDialogAction = useOpenDialogAction();

  if (!edit) {
    return (
      <BaseLayout title="Topic page">
        <LoaderDialog />
      </BaseLayout>
    );
  }

  const onSave = () => {
    openDialogAction(DIALOG_TYPE.SIMPLE_DIALOG, {
      type: SIMPLE_DIALOG_TYPE.QUESTION,
      title: "Do you want to save an article?",
      onSubmit: saveEditedArticleAction
    } as SimpleDialogContext);
  };

  return (
    <BaseLayout title="Topic page">
      <Editor text={edit.text} onChange={text => editArticleAction({ text })} />
      <Fab
        color="secondary"
        aria-label="Save"
        className={[classes.fab, classes.fabSave].join(" ")}
        onClick={onSave}
      >
        <SaveIcon />
      </Fab>
    </BaseLayout>
  );
};

type Props = {
  initialReduxState: DeepPartial<AppState>;
};

interface Params {
  topicId: string;
  articleId: string;
}

export const getServerSideProps = getPrivatePageProps<Props, Params>(
  async (params, amplifyInstance, currentUser) => {
    ArticleApi.setAmplifyInstance(amplifyInstance);
    const { article, topic } = await ArticleApi.getArticlePage(
      params.topicId,
      params.articleId
    );
    const initialReduxState: DeepPartial<AppState> = {};
    initialReduxState.authReducer = {
      currentUser
    };
    initialReduxState.articleReducer = {
      articles: [article],
      edit: _.pick(article, ["id", "title", "text"])
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
export default EditArticlePage;
