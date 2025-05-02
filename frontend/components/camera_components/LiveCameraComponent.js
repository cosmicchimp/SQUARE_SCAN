import { Camera } from 'expo-camera';
import { GLView } from 'expo-gl';
import { useRef, useEffect, useState } from 'react';

export default function LiveCameraDetection() {
    const [permission, requirePermission] = Camera.requestCameraPermissionsAsync();
    const cameraRef = useRef(null);

    // Ask for camera permission 
    useEffect(() => { if (!permission?.granted) requirePermission(); }, []);

    const captureAndSendFrame = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ base64: true});
        }
    }

    // Detect a specified amount of times (ms, s)
    useEffect(() => {
        const interval = setInterval(captureAndSendFrame, 1000); // every sec
        return () => clearInterval(interval);
    }, []);

    return (
        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
        />
      );
}