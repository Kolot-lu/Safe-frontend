export type Unit = 'ETH' | 'Gwei' | 'Wei';

/**
 * Converts ETH to Gwei.
 */
export const ethToGwei = (eth: number): number => {
  return eth * 1_000_000_000;
}

/**
 * Converts ETH to Wei.
 */
export const ethToWei = (eth: number): number => {
  return eth * 1_000_000_000_000_000_000;
}

/**
 * Converts a value in a given unit back to ETH.
 */
export const fromUnit = (value: number, unit: Unit): number => {
  if (unit === 'Wei') return value / 1_000_000_000_000_000_000;
  if (unit === 'Gwei') return value / 1_000_000_000;
  return value; // ETH by default
}

/**
 * Converts a value in ETH to a specified unit.
 */
export const toUnit = (eth: number, unit: Unit): number => {
  if (unit === 'Wei') return ethToWei(eth);
  if (unit === 'Gwei') return ethToGwei(eth);
  return eth; // ETH by default
}

/**
 * Formats a number with a fixed number of decimal places.
 */
export const formatNumber = (num: number, decimals = 8): string => {
  return num.toFixed(decimals);
}
