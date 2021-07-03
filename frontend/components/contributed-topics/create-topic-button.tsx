import * as React from "react";
import { FC, useState } from "react";
import { Button } from "@material-ui/core";
import { DialogInput } from "../common/dialogs/dialog-input";
import { useCreateTopicAction } from "../../store/topic/hook";

export const CreateTopicButton: FC = () => {
  const [isOpened, setIsOpened] = useState(false);
  const createTopicAction = useCreateTopicAction();
  return (
    <>
      <Button
        variant={"contained"}
        color={"primary"}
        onClick={() => setIsOpened(true)}
      >
        Create topic
      </Button>
      <DialogInput
        open={isOpened}
        onClose={() => setIsOpened(false)}
        title={"New topic"}
        inputLabel={"Name"}
        onSubmit={(name: string) => {
          createTopicAction(name);
          setIsOpened(false);
        }}
      />
    </>
  );
};
