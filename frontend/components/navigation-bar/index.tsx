import React, { FunctionComponent } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import {
  createStyles,
  fade,
  Theme,
  makeStyles
} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { useRouter } from "next/router";
import { CurrentUserPanel } from "./current-user-panel";
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import { AuthPanel } from "./auth-panel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      maxWidth: 1280,
      alignSelf: "center",
      width: "100%"
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto"
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch"
        }
      }
    }
  })
);

export const NavigationBar: FunctionComponent = () => {
  const classes = useStyles();
  const router = useRouter();
  const currentUser = useSelector(
    (state: AppState) => state.authReducer.currentUser
  );
  const handleRouteToHome = (e: any) => {
    e.preventDefault();
    router.push("/");
  };
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolBar}>
        <Typography
          className={classes.title}
          variant="h6"
          noWrap
          onClick={handleRouteToHome}
        >
          MemoriseIT
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        {currentUser ? (
          <CurrentUserPanel currentUser={currentUser} />
        ) : (
          <AuthPanel />
        )}
      </Toolbar>
    </AppBar>
  );
};
