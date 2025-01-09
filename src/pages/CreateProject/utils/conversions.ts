import { ethToGwei, ethToWei, formatNumber } from '../../../helpers/converters';

const MOCK_ETH_PRICE_USD = 3663;

export function showConversions(ethValue: number): string {
  const gweiValue = ethToGwei(ethValue);
  const weiValue = ethToWei(ethValue);
  return `ETH: ${formatNumber(ethValue)} | Gwei: ${gweiValue.toFixed(2)} | Wei: ${weiValue.toFixed(0)}`;
}

export function showUSDConversion(ethValue: number): string {
  const usdValue = ethValue * MOCK_ETH_PRICE_USD;
  return `~$${usdValue.toFixed(4)} USD (mock)`;
}
