import { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export function useLiveOrientation() {
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    // Initial fetch
    ScreenOrientation.getOrientationAsync().then(setOrientation);

    // Listener
    const sub = ScreenOrientation.addOrientationChangeListener(evt => {
      setOrientation(evt.orientationInfo.orientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(sub);
    };
  }, []);

  return orientation; // Will be a constant like ScreenOrientation.Orientation.LANDSCAPE_LEFT, etc.
}
