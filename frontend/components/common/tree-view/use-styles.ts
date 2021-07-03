import { createStyles, makeStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

export const useStyles = makeStyles(theme =>
  createStyles({
    row: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      marginLeft: "2px",
      height: "32px",
      "&:hover": {
        backgroundColor: blue[100]
      }
    },
    selectedRow: {
      backgroundColor: blue[300],
      "&:hover": {
        backgroundColor: blue[300]
      }
    },
    treeLevel: {
      marginLeft: "24px"
    },
    nestedList: {
      borderLeft: "1px dotted black",
      marginLeft: "12px"
    },
    label: {
      marginLeft: theme.spacing(1),
      display: "block",
      width: "100%",
      lineHeight: "32px",
      cursor: "pointer"
    },
    icon: {
      cursor: "pointer"
    },
    expandIcon: {
      position: "absolute",
      left: 0,
      marginLeft: "-24px"
    }
  })
);
