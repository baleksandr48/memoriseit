import { createStyles, makeStyles, Theme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";

export const useLayoutStyles = makeStyles((theme: Theme) =>
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
