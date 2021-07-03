import React, { FunctionComponent } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import {
  useRedirectArticleEditPageAction,
  useRedirectArticlePageAction,
  useRedirectArticleTestsEditPageAction
} from "../../../../store/article/hook";
import { Position } from "./types";
import { useRemoveArticleAction } from "../../../../store/topic/hook";
import { useOpenDialogAction } from "../../../../store/dialog/hook";
import {
  DIALOG_TYPE,
  SIMPLE_DIALOG_TYPE,
  SimpleDialogContext
} from "../../../../store/dialog/types";

interface Props {
  onClose(): void;
  articleId: number;
  topicId: number;
  position: Position;
}

export const ArticleContextMenu: FunctionComponent<Props> = ({
  onClose,
  articleId,
  topicId,
  position
}) => {
  const redirectArticleEditPageAction = useRedirectArticleEditPageAction();
  const redirectArticleTestsEditPageAction = useRedirectArticleTestsEditPageAction();
  const redirectArticlePageAction = useRedirectArticlePageAction();
  const removeArticleAction = useRemoveArticleAction();
  const openDialogAction = useOpenDialogAction();

  const onOpenArticleClick = () => {
    onClose();
    redirectArticlePageAction(articleId, topicId);
  };
  const onEditArticleClick = () => {
    onClose();
    redirectArticleEditPageAction(articleId, topicId);
  };
  const onEditTestsClick = () => {
    onClose();
    redirectArticleTestsEditPageAction(articleId, topicId);
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
      <MenuItem onClick={onOpenArticleClick}>Open</MenuItem>
      <MenuItem onClick={onEditArticleClick}>Edit</MenuItem>
      <MenuItem onClick={onEditTestsClick}>Edit tests</MenuItem>
      <MenuItem onClick={onRemoveArticleClick}>Remove</MenuItem>
    </Menu>
  );
};
