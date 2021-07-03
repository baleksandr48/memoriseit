import React, { FunctionComponent, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles(theme => ({}));

interface Props {
  classNames: string[];
  label: string;
  variant: "filled" | "standard" | "outlined";
  value: string;
  onChange: (e: any) => void;
  size: "small" | "medium";
  error?: boolean;
  helperText?: string;
  fullWidth: boolean;
  showPassword?: boolean;
  name?: string;
  setShowPassword?: (value: boolean) => void;
}

export const TextFieldPassword: FunctionComponent<Props> = ({
  classNames,
  label,
  variant,
  value,
  onChange,
  size,
  error,
  helperText,
  fullWidth,
  showPassword,
  setShowPassword,
  name
}) => {
  const classes = useStyles();
  const [showPasswordLocal, setShowPasswordLocal] = useState(false);

  return (
    <FormControl
      className={clsx(...classNames)}
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      error={error}
    >
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        name={name}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() =>
                setShowPassword
                  ? setShowPassword(!showPassword)
                  : setShowPasswordLocal(!showPasswordLocal)
              }
              edge="end"
              size={size}
              tabIndex={-1}
            >
              {showPassword || showPasswordLocal ? (
                <Visibility />
              ) : (
                <VisibilityOff />
              )}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      <FormHelperText id="outlined-weight-helper-text">
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};
