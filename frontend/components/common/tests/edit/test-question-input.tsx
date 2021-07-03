import React, { FunctionComponent } from "react";
import { TextField } from "@material-ui/core";

interface Props {
  question: string;
  onChange(newQuestion: string): void;
}

export const TestQuestionInput: FunctionComponent<Props> = ({
  question,
  onChange
}) => {
  return (
    <TextField
      fullWidth
      multiline
      variant={"outlined"}
      value={question}
      name={"question"}
      label={"Question"}
      onChange={event => onChange(event.target.value)}
    />
  );
};
