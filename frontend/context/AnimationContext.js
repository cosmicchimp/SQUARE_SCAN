import React, { createContext, useState } from "react";

export const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimationContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </AnimationContext.Provider>
  );
};
