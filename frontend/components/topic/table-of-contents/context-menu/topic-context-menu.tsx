import React, { FunctionComponent } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { Position } from "./types";
import { useOpenDialogAction } from "../../../../store/dialog/hook";
import {
  DIALOG_TYPE,
  SIMPLE_DIALOG_TYPE,
  SimpleDialogContext
} from "../../../../store/dialog/types";
import { useCreateEmptyArticleAction } from "../../../../store/article/hook";

interface Props {
  onClose(): void;
  topicId: number;
  position: Position;
}

export const TopicContextMenu: FunctionComponent<Props> = ({
  onClose,
  topicId,
  position
}) => {
  const openDialogAction = useOpenDialogAction();
  const createEmptyArticleAction = useCreateEmptyArticleAction();

  const onCreateDirectoryClick = () => {
    onClose();
    openDialogAction(DIALOG_TYPE.SIMPLE_DIALOG, {
      type: SIMPLE_DIALOG_TYPE.INPUT,
      inputLabel: "Name",
      title: "Add directory",
      onSubmit: (title: string) =>
        createEmptyArticleAction({
          topicId,
          title,
          isGroup: true
        })
    } as SimpleDialogContext);
  };

  const onCreateArticleClick = () => {
    onClose();
    openDialogAction(DIALOG_TYPE.SIMPLE_DIALOG, {
      type: SIMPLE_DIALOG_TYPE.INPUT,
      inputLabel: "Name",
      title: "Add article",
      onSubmit: (title: string) =>
        createEmptyArticleAction({
          topicId,
          title,
          isGroup: false
        })
    } as SimpleDialogContext);
  };

  return (
    <Menu
      keepMounted
      open
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position}
    >
      <MenuItem onClick={onCreateDirectoryClick}>Add directory</MenuItem>
      <MenuItem onClick={onCreateArticleClick}>Add article</MenuItem>
    </Menu>
  );
};
