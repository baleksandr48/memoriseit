import React, { FC } from "react";
import { MinusSquare } from "../icons/minus";
import { PlusSquare } from "../icons/plus";
import { useStyles } from "./use-styles";

interface Props {
  isExpanded: boolean;
  onClick?: () => void;
}

export const ExpandIcon: FC<Props> = ({ isExpanded, onClick = () => {} }) => {
  const classes = useStyles();

  const onExpandIconClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  };
  return isExpanded ? (
    <MinusSquare
      className={[classes.icon, classes.expandIcon].join(" ")}
      onClick={onExpandIconClick}
    />
  ) : (
    <PlusSquare
      className={[classes.icon, classes.expandIcon].join(" ")}
      onClick={onExpandIconClick}
    />
  );
};
