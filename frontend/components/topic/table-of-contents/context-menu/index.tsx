import React, { FC } from "react";
import { Position } from "./types";
import { TableOfContents } from "../../../../store/topic/types";
import { DirectoryContextMenu } from "./article-group-context-menu";
import { ArticleContextMenu } from "./article-context-menu";
import { TopicContextMenu } from "./topic-context-menu";

interface Props {
  onClose(): void;
  topicId: number;
  position?: Position;
  chosenElement?: TableOfContents;
}

export const TopicTableOfContentsContextMenu: FC<Props> = ({
  onClose,
  topicId,
  position,
  chosenElement
}) => {
  if (!position) {
    return null;
  }
  if (!chosenElement) {
    return (
      <TopicContextMenu
        topicId={topicId}
        position={position}
        onClose={onClose}
      />
    );
  }
  if (chosenElement.children) {
    return (
      <DirectoryContextMenu
        topicId={topicId}
        articleId={chosenElement.id}
        onClose={onClose}
        position={position}
      />
    );
  }
  return (
    <ArticleContextMenu
      topicId={topicId}
      articleId={chosenElement.id}
      onClose={onClose}
      position={position}
    />
  );
};
