import React, { useState, useEffect, useCallback } from "react";

const useTimer = ({
  initialSeconds,
  onTimerEnd,
}: {
  initialSeconds: number;
  onTimerEnd: () => void;
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const restartTimer = useCallback(() => {
    setIsActive(false);
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (isActive && seconds > 0) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setIsActive(false);
      onTimerEnd();
    }
  }, [seconds, onTimerEnd]);

  const formattedTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return { seconds, formattedTime, startTimer, restartTimer, isActive };
};

export default useTimer;
