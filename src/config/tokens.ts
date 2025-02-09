import { Network, ZERO_ADDRESS } from './chains';

/**
 * @fileoverview Stores testnet token lists categorized by networks.
 */

/**
 * Token structure.
 * @typedef {Object} Token
 * @property {string} name - The token name.
 * @property {string} address - The token address.
 */
export interface Token {
  name: string;
  address: string;
}

/**
 * Mapping of testnet tokens by network.
 */
export const initTokensList: Record<Network, Token[]> = {
  [Network.EthereumMainnet]: [{ name: 'ETH', address: ZERO_ADDRESS }],
  [Network.EthereumSepolia]: [
    { name: 'ETH', address: ZERO_ADDRESS },
    { name: 'USDT', address: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06' },
    { name: 'WBTC', address: '0xe474b1939D11E17325B9A698462D89D3c47186F9' },
    { name: 'DAI', address: '0x68194a729C2450ad26072b3D33ADaCbcef39D574' },
    { name: 'USDC', address: '0x097Da51357837f9A0760B04cae4c23c3ebE28B00' },
  ],
  [Network.TronMainnet]: [{ name: 'TRX', address: ZERO_ADDRESS }],
};
