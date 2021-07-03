import React, { FunctionComponent } from "react";
import { TextField, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TestOrderingAnswer } from "../../../../store/test/types";
import { Delete, DragHandle } from "@material-ui/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const useStyles = makeStyles(theme => ({
  answers: {
    display: "grid",
    gridTemplateColumns: "25px auto 25px"
  }
}));

interface Props {
  answers: TestOrderingAnswer[];
  onChange(position: number, changes: Partial<TestOrderingAnswer>): void;
  onMove(sourcePosition: number, destinationPosition?: number): void;
  onRemove(position: number): void;
}

const emptyAnswer: TestOrderingAnswer = {
  text: "",
  correctPosition: 0
};

export const TestOrderingAnswersEdit: FunctionComponent<Props> = ({
  answers,
  onChange,
  onMove,
  onRemove
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
            {[...answers, emptyAnswer].map(
              ({ text, correctPosition }, position) => {
                const isLastAnswer = answers.length === position;
                const lineComponent = (
                  <>
                    <IconButton aria-label="move" disabled={isLastAnswer}>
                      <DragHandle fontSize="small" />
                    </IconButton>
                    <TextField
                      fullWidth
                      value={text}
                      name={"text"}
                      onChange={event =>
                        onChange(position, {
                          text: event.target.value
                        })
                      }
                    />
                    <IconButton
                      aria-label="delete"
                      disabled={isLastAnswer}
                      onClick={() => onRemove(position)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </>
                );
                if (isLastAnswer) {
                  return <div className={classes.answers}>{lineComponent}</div>;
                }
                return (
                  <Draggable
                    draggableId={text}
                    index={position}
                    isDragDisabled={isLastAnswer}
                    key={text}
                  >
                    {(provided, snapshot) => {
                      return (
                        <div
                          key={text}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={classes.answers}
                        >
                          {lineComponent}
                        </div>
                      );
                    }}
                  </Draggable>
                );
              }
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
