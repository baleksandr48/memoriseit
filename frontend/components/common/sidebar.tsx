import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Paper } from "@material-ui/core";
import { Menu, MenuOpen } from "@material-ui/icons";
import { SidebarTableOfContents } from "./table-of-contents";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "350px",
    marginLeft: ({ isOpen }: { isOpen: boolean }) => (isOpen ? 0 : "-350px"),
    position: "relative",
    transition: `margin-left 0.5s`,
  },
  openCloseButton: {
    position: "absolute",
    left: "100%",
  },
}));

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const classes = useStyles({ isOpen });
  return (
    <Paper className={classes.root}>
      <IconButton
        className={classes.openCloseButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <MenuOpen /> : <Menu />}
      </IconButton>
      <SidebarTableOfContents />
    </Paper>
  );
}
