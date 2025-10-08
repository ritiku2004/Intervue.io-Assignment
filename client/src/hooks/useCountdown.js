import { useState, useEffect, useCallback, useRef } from 'react';

export const useCountdown = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Use a ref to store the interval ID to prevent stale closures
  const intervalRef = useRef(null);

  const start = useCallback((duration) => {
    // Clear any existing timer before starting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setSeconds(duration);
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  }, []);

  // Cleanup effect to clear the interval when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { seconds, start, isRunning };
};

