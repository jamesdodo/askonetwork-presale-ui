import React from 'react';
import { useTimer } from 'react-timer-hook';
import { Text } from "@chakra-ui/core"

export default function CountDown({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });


  return (
    <div style={{textAlign: 'center'}}>
      <Text fontSize={{base:"50px", md:"100px"}} >
        <span>{days.toString().padStart(2,'0')}</span>:<span>{hours.toString().padStart(2,'0')}</span>:<span>{minutes.toString().padStart(2,'0')}</span>:<span>{seconds.toString().padStart(2,'0')}</span>
      </Text>
    </div>
  );
}
