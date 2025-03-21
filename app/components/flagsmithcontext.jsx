"use client"
// components/flagsmithcontext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import flagsmith from "flagsmith";

// Create the context with a default value
const defaultContext = {
  isLoading: true,
  hasFeature: () => false,
  getValue: (_, defaultValue) => defaultValue,
  getAllFlags: () => ({}),
  identifyUser: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshFlags: () => Promise.resolve(),
};

// Create the context
const FlagsmithContext = createContext(defaultContext);

// Create a custom hook to use the context
export function useFlagsmith() {
  const context = useContext(FlagsmithContext);
  if (!context) {
    console.error("useFlagsmith must be used within a FlagsmithProvider");
  }
  return context;
}

// Create a provider component
const FlagsmithProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const environmentID = process.env.NEXT_PUBLIC_FLAGSMITH_ENVIRONMENT_ID;
    console.log("Flagsmith: Attempting to initialize with environment ID:", environmentID);

    if (!environmentID || environmentID === "Not configured") {
      console.error("Flagsmith: Environment ID is not set or invalid. Please check your .env file.");
      setIsLoading(false);
      return;
    }

    flagsmith
      .init({
        environmentID,
        cacheFlags: true,
        onChange: () => {
          console.log("Flagsmith: Flags updated:", flagsmith.getAllFlags());
          setIsInitialized(true);
          setIsLoading(false);
        },
      })
      .then(() => {
        console.log("Flagsmith: Initialized successfully with flags:", flagsmith.getAllFlags());
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error("Flagsmith: Failed to initialize:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const hasFeature = (flagName) => {
    if (!isInitialized) {
      console.warn(`Flagsmith: Not initialized yet, returning false for ${flagName}`);
      return false;
    }
    try {
      const result = flagsmith.hasFeature(flagName);
      console.log(`Flagsmith: hasFeature(${flagName}) = ${result}`);
      return result;
    } catch (error) {
      console.error(`Flagsmith: Error checking feature ${flagName}:`, error);
      return false;
    }
  };

  const getValue = (flagName, defaultValue = null) => {
    if (!isInitialized) return defaultValue;
    try {
      return flagsmith.getValue(flagName, defaultValue);
    } catch (error) {
      console.error(`Flagsmith: Error getting value for ${flagName}:`, error);
      return defaultValue;
    }
  };

  const getAllFlags = () => {
    if (!isInitialized) return {};
    try {
      return flagsmith.getAllFlags();
    } catch (error) {
      console.error("Flagsmith: Error getting all flags:", error);
      return {};
    }
  };

  const identifyUser = async (userId, traits = {}) => {
    if (!isInitialized) return Promise.resolve();
    try {
      return await flagsmith.identify(userId, traits);
    } catch (error) {
      console.error(`Flagsmith: Error identifying user ${userId}:`, error);
      return Promise.resolve();
    }
  };

  const logout = async () => {
    if (!isInitialized) return Promise.resolve();
    try {
      return await flagsmith.logout();
    } catch (error) {
      console.error("Flagsmith: Error logging out:", error);
      return Promise.resolve();
    }
  };

  const refreshFlags = async () => {
    setIsLoading(true);
    if (isInitialized) {
      try {
        await flagsmith.getFlags();
        console.log("Flagsmith: Flags refreshed:", flagsmith.getAllFlags());
      } catch (error) {
        console.error("Flagsmith: Error refreshing flags:", error);
      }
    }
    setIsLoading(false);
    return Promise.resolve();
  };

  const contextValue = {
    isLoading,
    hasFeature,
    getValue,
    getAllFlags,
    identifyUser,
    logout,
    refreshFlags,
  };

  return (
    <FlagsmithContext.Provider value={contextValue}>
      {children}
    </FlagsmithContext.Provider>
  );
};

export { FlagsmithProvider };