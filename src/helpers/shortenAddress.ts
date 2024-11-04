/**
 * @function shortenAddress
 * @description Formats a wallet address by keeping only the first and last few characters, adding ellipsis in between.
 * Useful for displaying long addresses in a more compact form.
 * 
 * @param {string} address - The full wallet address to shorten.
 * @param {number} charsStart - Number of characters to keep at the start of the address.
 * @param {number} charsEnd - Number of characters to keep at the end of the address.
 * @returns {string} The formatted address.
 * 
 * @example
 * shortenAddress("0xc777D41F2611B234567J7C778785bdD4cB543C14"); // "0xc777...3C14"
 */
export function shortenAddress(address: string, charsStart: number = 6, charsEnd: number = 4): string {
    if (!address) return '';
    return `${address.slice(0, charsStart)}...${address.slice(-charsEnd)}`;
  }
  