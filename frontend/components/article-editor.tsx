import React from "react";
import {
  Box,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import Editor from "./editor";

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
    },
    titleInput: {
      fontSize: "2rem"
    },
    fabSave: {
      bottom: theme.spacing(4) + 48,
      backgroundColor: "#10bc29"
    },
    fabCancel: {
      bottom: theme.spacing(2),
      backgroundColor: "#d72f2f"
    },
    fab: {
      right: theme.spacing(2),
      height: 48,
      width: 48,
      color: "white",
      position: "fixed"
    },
    error: {
      padding: theme.spacing(1),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.error.main,
      borderRadius: 8
    }
  })
);

type Props = {
  title: string;
  text: string;
  error: string | null;
  onChangeTitle: (title: string) => void;
  onChangeText: (title: string) => void;
  onSave: () => void;
  onClose: () => void;
};

const ArticleEditor: React.FunctionComponent<Props> = ({
  text,
  title,
  onChangeText,
  onChangeTitle,
  error,
  onSave,
  onClose
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.mainPart}>
        <Box className={classes.childrenContainer}>
          {error && (
            <Typography
              className={classes.error}
              children={`Something went wrong. Can't save article.`}
            />
          )}
          <TextField
            fullWidth
            placeholder={"Title.."}
            InputProps={{
              classes: {
                input: classes.titleInput
              }
            }}
            value={title}
            onChange={e => onChangeTitle(e.target.value)}
          />
          <Editor text={text} onChange={text => onChangeText(text)} />
        </Box>
      </Box>

      <Fab
        color="secondary"
        aria-label="Cancel"
        className={[classes.fab, classes.fabCancel].join(" ")}
        onClick={onClose}
      >
        <ClearIcon />
      </Fab>
    </Box>
  );
};
export default ArticleEditor;
