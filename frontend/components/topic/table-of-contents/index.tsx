import React, { FC, useState } from "react";
import { TreeView } from "../../common/tree-view";
import { Topic } from "../../../store/topic/types";
import {
  useTopicTableOfContentsSetSelectedAction,
  useTopicTableOfContentsToggleIsExpandedAction
} from "../../../store/topic/hook";
import { TreeViewData } from "../../common/tree-view/types";
import { TopicTableOfContentsContextMenu } from "./context-menu";
import { Position } from "./context-menu/types";

interface Props {
  topic: Topic;
}

export const TopicTableOfContents: FC<Props> = ({ topic }) => {
  const toggleIsExpandedAction = useTopicTableOfContentsToggleIsExpandedAction();
  const setSelectedRowAction = useTopicTableOfContentsSetSelectedAction();
  const [position, setPosition] = useState<Position>();
  const [chosenElement, setChosenElement] = useState<TreeViewData>();

  const onElementClick = (element: TreeViewData) => {
    setSelectedRowAction(topic.id, element.id);
    if (element.children) {
      toggleIsExpandedAction(topic.id, element.id);
    }
  };

  const onElementContextMenu = (
    element: TreeViewData,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setSelectedRowAction(topic.id, element.id);
    setChosenElement(element);
    setPosition({
      top: event.clientY - 4,
      left: event.clientX - 2
    });
  };

  const onRootContextMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setChosenElement(undefined);
    setPosition({
      top: event.clientY - 4,
      left: event.clientX - 2
    });
  };

  return (
    <>
      <TreeView
        data={topic.tableOfContents}
        onExpandIconClick={element =>
          toggleIsExpandedAction(topic.id, element.id)
        }
        onElementContextMenu={onElementContextMenu}
        onRootContextMenu={onRootContextMenu}
        onElementClick={onElementClick}
      />
      <TopicTableOfContentsContextMenu
        position={position}
        topicId={topic.id}
        chosenElement={chosenElement}
        onClose={() => setPosition(undefined)}
      />
    </>
  );
};
