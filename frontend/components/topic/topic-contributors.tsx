import React, { FunctionComponent } from "react";
import { createStyles, Theme, makeStyles, Button } from "@material-ui/core";
import { TopicContributorsTable } from "./topic-contributors-table";
import { Contributor } from "../../store/topic/types";
import {
  DIALOG_TYPE,
  SIMPLE_DIALOG_TYPE,
  SimpleDialogContext
} from "../../store/dialog/types";
import { useOpenDialogAction } from "../../store/dialog/hook";
import { useAddContributorAction } from "../../store/topic/hook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rightPositioned: {
      alignSelf: "flex-end"
    }
  })
);

type Props = {
  contributors: Contributor[];
  currentUserEmail: string;
};

export const TopicContributors: FunctionComponent<Props> = ({
  contributors,
  currentUserEmail
}) => {
  const classes = useStyles();
  const openDialogAction = useOpenDialogAction();
  const addContributorAction = useAddContributorAction();

  const onClick = () => {
    openDialogAction(DIALOG_TYPE.SIMPLE_DIALOG, {
      type: SIMPLE_DIALOG_TYPE.INPUT,
      inputLabel: "Email",
      title: "Invite contributor",
      onSubmit: (email: string) => addContributorAction(email)
    } as SimpleDialogContext);
  };

  return (
    <>
      <Button
        variant={"contained"}
        color={"secondary"}
        className={classes.rightPositioned}
        onClick={onClick}
      >
        Add editor
      </Button>
      <TopicContributorsTable
        contributors={contributors}
        currentUserEmail={currentUserEmail}
      />
    </>
  );
};
