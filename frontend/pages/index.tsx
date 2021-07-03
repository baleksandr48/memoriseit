import React from "react";
import { BaseLayout } from "../components";
import { Box, createStyles, makeStyles, Theme } from "@material-ui/core";
import { useHandleRedirectForAuth } from "../store/auth/hook";
import { DeepPartial } from "../utils/types";
import { AppState } from "../store";
import { useSelector } from "react-redux";
import {
  getPrivatePageProps,
  getPublicPageProps
} from "../utils/get-server-side-props";
import { TopicApi } from "../api/topic-api";

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
interface Props {
  initialReduxState: DeepPartial<AppState>;
}

const Home: React.FunctionComponent<Props> = () => {
  const classes = useStyles();
  useHandleRedirectForAuth();
  const { topics } = useSelector((appState: AppState) => appState.topicReducer);
  return (
    <BaseLayout title="Home page">
      <Box className={classes.root}>
        <Box className={classes.mainPart}>
          <Box className={classes.childrenContainer}></Box>
        </Box>
      </Box>
    </BaseLayout>
  );
};

export const getServerSideProps = getPublicPageProps<Props>(
  async (params, amplifyInstance, currentUser) => {
    TopicApi.setAmplifyInstance(amplifyInstance);
    const initialReduxState: DeepPartial<AppState> = {};
    initialReduxState.authReducer = {
      currentUser
    };
    return {
      props: {
        initialReduxState
      }
    };
  }
);

export default Home;
