/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized or an empty string if input is invalid
 */
const capitalize = (str: string = ''): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default capitalize;
