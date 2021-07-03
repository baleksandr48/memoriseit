import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { useRedirectArticlePageAction } from "../../store/article/hook";
import { TreeView } from "./tree-view";
import {
  useTopicTableOfContentsSetSelectedAction,
  useTopicTableOfContentsToggleIsExpandedAction
} from "../../store/topic/hook";
import { TreeViewData } from "./tree-view/types";

export const SidebarTableOfContents = () => {
  const toggleIsExpandedAction = useTopicTableOfContentsToggleIsExpandedAction();
  const setSelectedAction = useTopicTableOfContentsSetSelectedAction();
  const redirectArticlePageAction = useRedirectArticlePageAction();
  const {
    topics: [topic]
  } = useSelector((store: AppState) => store.topicReducer);

  const onElementClick = (element: TreeViewData) => {
    if (element.children) {
      toggleIsExpandedAction(topic.id, element.id);
      setSelectedAction(topic.id, element.id);
    } else {
      redirectArticlePageAction(element.id, topic.id);
    }
  };
  return (
    <TreeView
      hideRootElement
      data={topic.tableOfContents}
      onExpandIconClick={element =>
        toggleIsExpandedAction(topic.id, element.id)
      }
      onElementClick={onElementClick}
    />
  );
};
