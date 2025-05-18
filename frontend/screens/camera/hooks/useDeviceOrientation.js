import { useEffect, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState('UNKNOWN');

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y }) => {
      if (Math.abs(x) > Math.abs(y)) {
        setOrientation(x > 0 ? 'LANDSCAPE_RIGHT' : 'LANDSCAPE_LEFT');
      } else {
        setOrientation(y > 0 ? 'PORTRAIT_UPSIDE_DOWN' : 'PORTRAIT');
      }
    });

    Accelerometer.setUpdateInterval(250); // Adjust as needed

    return () => {
      subscription.remove();
    };
  }, []);

  return orientation;
}
