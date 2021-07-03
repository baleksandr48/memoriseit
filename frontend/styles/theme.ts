import { createMuiTheme } from '@material-ui/core/styles';

export const colors = {
    blue: "#5DA2D5",
    cyan: "#90CCF4",
    white: "#ECECEC",
    yellow: "#F3D250",
    red: "#F78888",
};

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.blue,
        },
        secondary: {
            main: colors.yellow,
        },
        error: {
            main: colors.red,
        },
        background: {
            default: colors.white,
        },
    },
});

export default theme;