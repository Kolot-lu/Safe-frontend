/**
 * @description This function retrieves an environment variable by its name.
 * If the variable is not set, it will throw an error, preventing the application
 * from running without required configuration.
 *
 * @param {string} key - The name of the environment variable.
 * @returns {string} - The value of the environment variable.
 * @throws Will throw an error if the environment variable is not set.
 */
const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value as string;
};

/**
 * @description Configuration object that consolidates all environment variables
 * used throughout the application. Ensures that required variables are provided
 * before the application starts.
 */
const config = {
  // Address of the deployed smart contract
  CONTRACT_ADDRESS: getEnvVariable('VITE_CONTRACT_ADDRESS'),
};

export default config;
