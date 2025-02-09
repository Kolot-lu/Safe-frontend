/**
 * Retrieves an environment variable safely.
 * Throws an error if the variable is missing.
 *
 * @param {string} key - Environment variable name
 * @returns {string} - The environment variable value
 */
export const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Environment variable ${key} is not set`);
  
  return value as string;
};

/**
 * Application-wide environment configuration.
 */
export const env = {
  CONTRACT_ADDRESS: getEnvVariable('VITE_CONTRACT_ADDRESS'),
  TRON_CONTRACT_ADDRESS: getEnvVariable('VITE_TRON_CONTRACT_ADDRESS'),
  RPC_URL: getEnvVariable('VITE_RPC_URL'),
};
