import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';

export default function CountdownTimer(props) {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(3);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1);
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
          clearInterval(countdown);
          props.changeTimerHandle(false, 'timer');
        } else {
          setMinutes(parseInt(minutes) - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  return (
    <Typography sx={{ fontSize: '12px', display: 'inline' }}>
      &nbsp;남은 시간&nbsp;{minutes}:
      {Number(seconds) < 10 ? '0' + seconds : seconds}
    </Typography>
  );
}
