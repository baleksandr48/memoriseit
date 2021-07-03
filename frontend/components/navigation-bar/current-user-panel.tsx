import React, { FunctionComponent } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import * as _ from "lodash";
import {
  useCloseAuthDialog,
  useOpenAuthDialogAction
} from "../../store/auth/hook";
import { useRouter } from "next/router";
import { AUTH_DIALOG, User } from "../../store/auth/types";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { LogoutDialog } from "./auth-panel/logout-dialog";

interface Props {
  currentUser: User;
}

export const CurrentUserPanel: FunctionComponent<Props> = ({ currentUser }) => {
  const router = useRouter();
  const openAuthDialogAction = useOpenAuthDialogAction();
  const closeAuthDialog = useCloseAuthDialog();
  const nickname = _.get(currentUser, "nickname");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const { openedDialog } = useSelector((store: AppState) => store.authReducer);

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        {nickname}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem>Studied topics</MenuItem>
        <MenuItem onClick={() => router.push(`/topics/contributed`)}>
          Contributed topics
        </MenuItem>
        <MenuItem onClick={() => router.push(`/exams`)}>Exams</MenuItem>
        <MenuItem>Bookmarks</MenuItem>
        <MenuItem onClick={() => openAuthDialogAction(AUTH_DIALOG.LOGOUT)}>
          Logout
        </MenuItem>
      </Menu>
      {openedDialog === AUTH_DIALOG.LOGOUT && (
        <LogoutDialog onClose={closeAuthDialog} />
      )}
    </>
  );
};
