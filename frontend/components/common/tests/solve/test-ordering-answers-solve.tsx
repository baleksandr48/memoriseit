import React, { FunctionComponent } from "react";
import { IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TestOrderingAnswer } from "../../../../store/test/types";
import { DragHandle } from "@material-ui/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const useStyles = makeStyles(theme => ({
  answers: {
    display: "grid",
    gridTemplateColumns: "25px auto"
  },
  answerText: {
    lineHeight: 2.5
  }
}));

interface Props {
  answers: TestOrderingAnswer[];
  onMove(sourcePosition: number, destinationPosition?: number): void;
}

export const TestOrderingAnswersSolve: FunctionComponent<Props> = ({
  answers,
  onMove
}) => {
  const classes = useStyles();

  return (
    <DragDropContext
      onDragEnd={result =>
        onMove(result.source.index, result.destination?.index)
      }
    >
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div key={1} {...provided.droppableProps} ref={provided.innerRef}>
            {answers.map(({ text, correctPosition }, position) => {
              return (
                <Draggable draggableId={text} index={position} key={text}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        key={text}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={classes.answers}
                      >
                        <IconButton aria-label="move">
                          <DragHandle fontSize="small" />
                        </IconButton>
                        <Typography className={classes.answerText}>
                          {text}
                        </Typography>
                      </div>
                    );
                  }}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
