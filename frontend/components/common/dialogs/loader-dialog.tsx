import React, { FunctionComponent } from "react";
import { Dialog } from "@material-ui/core";
import Loader from "../loader";

interface Props {}

export const LoaderDialog: FunctionComponent<Props> = () => {
  return (
    <Dialog open={true}>
      <Loader />
    </Dialog>
  );
};
