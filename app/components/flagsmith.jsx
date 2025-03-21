import flagsmith from 'flagsmith';

export default flagsmith;

export const getFlag = (flagName) => {
  try {
    return flagsmith.hasFeature(flagName);
  } catch (error) {
    console.error(`Error checking feature ${flagName}:`, error);
    return false;
  }
};

export const getFlagValue = (flagName, defaultValue = null) => {
  try {
    return flagsmith.getValue(flagName, defaultValue);
  } catch (error) {
    console.error(`Error getting value for ${flagName}:`, error);
    return defaultValue;
  }
};

export const identifyUser = (userId, traits = {}) => {
  try {
    return flagsmith.identify(userId, traits);
  } catch (error) {
    console.error(`Error identifying user ${userId}:`, error);
    return Promise.resolve();
  }
};

export const logout = () => {
  try {
    return flagsmith.logout();
  } catch (error) {
    console.error("Error logging out:", error);
    return Promise.resolve();
  }
};
