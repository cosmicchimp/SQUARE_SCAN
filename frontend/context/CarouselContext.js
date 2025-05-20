// context/CarouselContext.js
import React, { createContext, useState, useContext } from 'react';
import { LayoutAnimation } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export const CarouselContext = createContext();

export const CarouselProvider = ({ children }) => {
  const scrollX = useSharedValue(0); // the value of the current index as a float from 0.0 to length
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [photos, setPhotos] = useState([]); 

   const isDragging = useSharedValue(false);

   const setIsDragging = (value) => {
    isDragging.value = value;
  };

  const deletePhoto = () => {
    if (photos.length > 0) {
      const index = Math.round(scrollX.value);
      const uriToDelete = photos[index];

      setPhotos(prevPhotos => prevPhotos.filter(uri => uri !== uriToDelete));

      if (photos.length === 0 && isEditMode) setIsEditMode(false);
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        photos,
        setPhotos,
        deletePhoto,
        isEditMode,
        setIsEditMode,
        scrollX,
        isDragging,
        setIsDragging
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};