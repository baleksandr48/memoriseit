import React, { FC, useCallback } from "react";
import Link from "next/link";
import {
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useContributedTopicListStyle } from "./topic-list.styles";
import { Topic } from "../../../store/topic/types";

interface Props {
  topics: Topic[];
  deleteTopic: (topicId: number) => void;
}

export const ContributedTopicList: FC<Props> = ({ topics, deleteTopic }) => {
  const classes = useContributedTopicListStyle();

  const handleDeleteTopicClick = useCallback(
    (topicId: number) => deleteTopic(topicId),
    []
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align={"left"}>Name</TableCell>
        </TableRow>
      </TableHead>
      {topics.map(topic => (
        <TableRow key={topic.id}>
          <TableCell>
            <Link href={`/topics/${topic.id}`}>{topic.name}</Link>
          </TableCell>
          <TableCell align={"right"}>
            <IconButton onClick={() => handleDeleteTopicClick(topic.id)}>
              <CloseIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};
