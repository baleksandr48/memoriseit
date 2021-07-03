import React, { FC } from "react";
import FolderIcon from "@material-ui/icons/Folder";
import DescriptionIcon from "@material-ui/icons/Description";
import { useStyles } from "./use-styles";

interface Props {
  isNode: boolean;
}

export const ElementIcon: FC<Props> = ({ isNode }) => {
  const classes = useStyles();
  return isNode ? (
    <FolderIcon className={classes.icon} />
  ) : (
    <DescriptionIcon className={classes.icon} />
  );
};
