'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import flagsmith from 'flagsmith';

const FlagsmithContext = createContext({
  isLoading: true,
  hasFeature: () => false,
  getValue: (_, defaultValue) => defaultValue,
  getAllFlags: () => ({}),
  identifyUser: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshFlags: () => Promise.resolve(),
});

export function useFlagsmith() {
  return useContext(FlagsmithContext);
}

const FlagsmithProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const environmentID = process.env.NEXT_PUBLIC_FLAGSMITH_ENVIRONMENT_ID;
    
    if (!environmentID) {
      console.error('❌ Flagsmith environment ID is missing. Check your .env.local file.');
      setIsLoading(false);
      return;
    }

    flagsmith
      .init({
        environmentID,
        cacheFlags: true,
        onChange: () => {
          console.log('✅ Flags updated:', flagsmith.getAllFlags());
          setIsInitialized(true);
          setIsLoading(false);
        },
      })
      .then(() => {
        console.log('🎉 Flagsmith initialized successfully.');
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error('⚠️ Failed to initialize Flagsmith:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <FlagsmithContext.Provider value={{ isLoading, hasFeature: flagsmith.hasFeature, getValue: flagsmith.getValue }}>
      {children}
    </FlagsmithContext.Provider>
  );
};

export { FlagsmithProvider };
