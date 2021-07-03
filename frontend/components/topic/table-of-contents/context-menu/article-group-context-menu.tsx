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
import { useRemoveArticleAction } from "../../../../store/topic/hook";

interface Props {
  onClose(): void;
  articleId: number;
  topicId: number;
  position: Position;
}

export const DirectoryContextMenu: FunctionComponent<Props> = ({
  onClose,
  articleId,
  topicId,
  position
}) => {
  const openDialogAction = useOpenDialogAction();
  const createEmptyArticleAction = useCreateEmptyArticleAction();
  const removeArticleAction = useRemoveArticleAction();

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
          parentId: articleId,
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
          parentId: articleId,
          isGroup: false
        })
    } as SimpleDialogContext);
  };

  const onRemoveArticleClick = () => {
    onClose();
    openDialogAction(DIALOG_TYPE.SIMPLE_DIALOG, {
      type: SIMPLE_DIALOG_TYPE.QUESTION,
      title: "Do you want to remove an article?",
      onSubmit: () =>
        removeArticleAction({
          topicId,
          articleId
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
      <MenuItem onClick={onRemoveArticleClick}>Remove</MenuItem>
    </Menu>
  );
};
