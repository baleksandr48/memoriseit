import React, { FunctionComponent } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Typography, Box, Button } from "@material-ui/core";
import { Topic } from "../../store/topic/types";
import { TreeView, TreeViewData } from "../common/tree-view";
import { blue, grey } from "@material-ui/core/colors";
import {
  useTopicTableOfContentsSetSelectedAction,
  useTopicTableOfContentsToggleIsExpandedAction
} from "../../store/topic/hook";

const useStyles = makeStyles(theme =>
  createStyles({
    header: {
      backgroundColor: blue[400],
      padding: theme.spacing(2)
    },
    headerText: {
      color: grey[100],
      fontWeight: 700
    },
    label: {
      marginLeft: theme.spacing(1),
      display: "block",
      width: "100%",
      lineHeight: "32px",
      cursor: "pointer"
    },
    row: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      "&:hover > $passTestBtn": {
        display: "block"
      }
    },
    passTestBtn: {
      marginLeft: theme.spacing(2),
      display: "none"
    }
  })
);

interface Props {
  topic: Topic;
}

export const TopicExams: FunctionComponent<Props> = ({ topic }) => {
  const classes = useStyles();
  const toggleIsExpandedAction = useTopicTableOfContentsToggleIsExpandedAction();
  const setSelectedRowAction = useTopicTableOfContentsSetSelectedAction();

  return (
    <div>
      <Box className={classes.header}>
        <Typography className={classes.headerText}>{topic.name}</Typography>
      </Box>
      <TreeView
        data={topic.tableOfContents}
        onExpandIconClick={(articleId: number) =>
          toggleIsExpandedAction(topic.id, articleId)
        }
        onNodeClick={(articleId: number) =>
          toggleIsExpandedAction(topic.id, articleId)
        }
        onSelectRow={(articleId: number) =>
          setSelectedRowAction(topic.id, articleId)
        }
        getCustomRow={(treeViewData: TreeViewData) => (
          <div className={classes.row}>
            <Typography
              component={"h6"}
              variant={"body1"}
              className={classes.label}
              onClick={() => {}}
              children={treeViewData.title}
            />
            <Button
              className={classes.passTestBtn}
              variant={"contained"}
              size={"small"}
              color={"secondary"}
              onClick={event => {
                event.stopPropagation();
              }}
            >
              Pass
            </Button>
          </div>
        )}
      />
    </div>
  );
};
