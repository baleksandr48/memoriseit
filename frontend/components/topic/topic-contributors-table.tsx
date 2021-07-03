import React, { FunctionComponent } from "react";
import {
  Paper,
  createStyles,
  Theme,
  makeStyles,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@material-ui/core";
import { Contributor } from "../../store/topic/types";
import { useRemoveContributorAction } from "../../store/topic/hook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      flexGrow: 1
    }
  })
);

type Props = {
  contributors: Contributor[];
  currentUserEmail: string;
};

export const TopicContributorsTable: FunctionComponent<Props> = ({
  contributors,
  currentUserEmail
}) => {
  const classes = useStyles();
  const removeContributorAction = useRemoveContributorAction();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contributors.map(contributor => (
            <TableRow key={contributor.user.email}>
              <TableCell component="th" scope="row">
                {contributor.user.name}
              </TableCell>
              <TableCell align="right">{contributor.user.email}</TableCell>
              <TableCell align="right">{contributor.type}</TableCell>
              {contributor.user.email !== currentUserEmail && (
                <TableCell align="right">
                  <Button
                    onClick={() => removeContributorAction(contributor.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
