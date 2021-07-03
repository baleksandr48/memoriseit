import React, { FC, ReactElement } from "react";
import { Typography } from "@material-ui/core";
import { TreeViewData } from "./types";
import { TreeViewElement } from "./tree-view-element";
import { useStyles } from "./use-styles";
import FolderIcon from "@material-ui/icons/Folder";

interface Props {
  data: TreeViewData;
  onElementClick?(element: TreeViewData): void;
  onRootClick?(): void;
  onExpandIconClick?(element: TreeViewData): void;
  onElementContextMenu?(
    element: TreeViewData,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void;
  onRootContextMenu?(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  getCustomRow?: (element: TreeViewData) => ReactElement;
  hideRootElement?: boolean;
}

export const TreeView: FC<Props> = ({
  data,
  onElementClick = () => {},
  onRootClick = () => {},
  onExpandIconClick = () => {},
  onElementContextMenu = () => {},
  onRootContextMenu = () => {},
  getCustomRow,
  hideRootElement = false
}) => {
  const classes = useStyles();

  if (!data.children) {
    return null;
  }
  const children = data.children.map(child => (
    <TreeViewElement
      data={child}
      onElementClick={onElementClick}
      onExpandIconClick={onExpandIconClick}
      onContextMenu={onElementContextMenu}
      getCustomRow={getCustomRow}
    />
  ));
  if (hideRootElement) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <div className={classes.treeLevel}>
      <div
        className={classes.row}
        onClick={onRootClick}
        onContextMenu={event => onRootContextMenu(event)}
      >
        <FolderIcon className={classes.icon} />
        <Typography component={"h6"} variant={"body1"} children={data.title} />
      </div>
      <div className={classes.nestedList}>{children}</div>
    </div>
  );
};
