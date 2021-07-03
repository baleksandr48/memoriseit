import React, { FunctionComponent } from "react";
import { MenuItem, FormControl, TextField } from "@material-ui/core";
import { TEST_TYPE } from "../../../../store/test/types";

interface Props {
  value: string;
  onChange(newValue: TEST_TYPE): void;
}

export const TestTypeSelect: FunctionComponent<Props> = ({
  value,
  onChange
}) => {
  return (
    <FormControl>
      <TextField
        select
        fullWidth
        value={value}
        name={"type"}
        onChange={event => onChange(event.target.value as TEST_TYPE)}
        label={"Test type"}
        variant={"outlined"}
      >
        <MenuItem value={TEST_TYPE.INPUT}>Text input</MenuItem>
        <MenuItem value={TEST_TYPE.SINGLE}>One correct answer</MenuItem>
        <MenuItem value={TEST_TYPE.MULTIPLE}>A few correct answers</MenuItem>
        <MenuItem value={TEST_TYPE.ORDERING}>Ordering</MenuItem>
      </TextField>
    </FormControl>
  );
};
