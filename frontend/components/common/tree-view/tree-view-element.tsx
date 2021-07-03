import React, { FC, ReactElement } from "react";
import { Typography } from "@material-ui/core";
import { TreeViewData } from "./types";
import { ExpandIcon } from "./expand-icon";
import { ElementIcon } from "./element-icon";
import { useStyles } from "./use-styles";

interface Props {
  data: TreeViewData;
  onElementClick?(element: TreeViewData): void;
  onExpandIconClick?(element: TreeViewData): void;
  onContextMenu?(
    element: TreeViewData,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void;
  getCustomRow?: (element: TreeViewData) => ReactElement;
}

export const TreeViewElement: FC<Props> = ({
  data,
  onElementClick = () => {},
  onExpandIconClick = () => {},
  onContextMenu = () => {},
  getCustomRow
}) => {
  const classes = useStyles();

  const rowClasses = [classes.row];
  if (data.isSelected) {
    rowClasses.push(classes.selectedRow);
  }
  const hasChildren = !!data.children?.length;
  const isNode = !!data.children;
  return (
    <div className={classes.treeLevel}>
      <div
        className={rowClasses.join(" ")}
        onContextMenu={event => {
          onContextMenu(data, event);
        }}
        onClick={() => onElementClick(data)}
      >
        {hasChildren && (
          <ExpandIcon
            isExpanded={!!data.isExpanded}
            onClick={() => onExpandIconClick(data)}
          />
        )}
        <ElementIcon isNode={isNode} />
        {getCustomRow ? (
          getCustomRow(data)
        ) : (
          <Typography
            component={"h6"}
            variant={"body1"}
            className={classes.label}
            children={data.title}
          />
        )}
      </div>
      {data.isExpanded && hasChildren && (
        <div className={classes.nestedList}>
          {data.children!.map(child => (
            <TreeViewElement
              key={child.id}
              data={child}
              onElementClick={onElementClick}
              onContextMenu={onContextMenu}
              onExpandIconClick={onExpandIconClick}
              getCustomRow={getCustomRow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
