import React, { FunctionComponent, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ButtonProps } from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({}));

type Props = Omit<ButtonProps, "children"> & {
  disabledUntil: number;
  disabledPrefix: string;
  value: string;
};

export const CountDownButton: FunctionComponent<Props> = ({
  disabledUntil,
  disabledPrefix,
  value,
  ...buttonProps
}) => {
  const classes = useStyles();
  const calculateRestTime = () => moment.unix(disabledUntil).diff(moment());
  const [restTime, setRestTime] = useState(calculateRestTime());
  useEffect(() => {
    const timeout = setTimeout(() => {
      const newRestTime = calculateRestTime();
      setRestTime(newRestTime);
    }, 1000);
    return () => clearTimeout(timeout);
  });
  let lastTimeHuman = null;
  if (restTime >= 1000) {
    const duration = moment.duration(restTime);
    const seconds = duration.seconds();
    const minutes = duration.minutes();
    const hours = duration.hours();
    const lastTime = [];
    if (hours) {
      lastTime.push(`${hours}h`);
    }
    if (minutes) {
      lastTime.push(`${minutes}m`);
    }
    if (seconds) {
      lastTime.push(`${seconds}s`);
    }
    lastTimeHuman = lastTime.join(" ");
  }
  const text = lastTimeHuman ? `${disabledPrefix} ${lastTimeHuman}` : value;
  return (
    <Button {...buttonProps} disabled={!!lastTimeHuman} value={text}>
      {text}
    </Button>
  );
};
