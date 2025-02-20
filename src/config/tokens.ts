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
    { name: 'USDT', address: '0x419Fe9f14Ff3aA22e46ff1d03a73EdF3b70A62ED'},
    { name: 'OKB', address: '0x3F4B6664338F23d2397c953f2AB4Ce8031663f80' },
    { name: 'DAI', address: '0xf5c142292B85253e4D071812c84f05ec42828fdB' },
    { name: 'USDC', address: '0x13fA158A117b93C27c55b8216806294a0aE88b6D' },
  ],
  [Network.TronMainnet]: [{ name: 'TRX', address: ZERO_ADDRESS }],
};
