import { BrowserProvider } from 'ethers';
import { WalletType } from './wallets';
import TronWeb from 'tronweb';

/**
 * Enum representing supported network types.
 */
export enum NetworkType {
  EVM = 'evm',
  TRON = 'tron',
}

/**
 * Interface defining a blockchain network configuration.
 */
export interface Chain {
  chainId: number;
  type: NetworkType;
  supportedWallets: WalletType[];
}

/**
 * Type alias for blockchain providers, covering both EVM and Tron providers.
 */
export type AppProviders = BrowserProvider | TronWeb;

/**
 * Enum representing supported network identifiers.
 */
export enum Network {
  EthereumSepolia = 'ethereum-sepolia',
  EthereumMainnet = 'ethereum-mainnet',
  TronMainnet = 'tron-mainnet',
}

/**
 * Mapping of supported networks to their corresponding chain configuration.
 */
export const CHAINS: Record<Network, Chain> = {
  [Network.EthereumSepolia]: {
    chainId: 11155111,
    type: NetworkType.EVM,
    supportedWallets: [WalletType.MetaMask, WalletType.WalletConnect],
  },
  [Network.EthereumMainnet]: {
    chainId: 1,
    type: NetworkType.EVM,
    supportedWallets: [WalletType.MetaMask, WalletType.WalletConnect],
  },
  [Network.TronMainnet]: {
    chainId: 728126428, // Tron chainId (non EVM-like)
    type: NetworkType.TRON,
    supportedWallets: [WalletType.TronLink],
  },
};

/**
 * Retrieves the network identifier based on the provided chain ID.
 *
 * @param {number} chainId - The chain ID to search for.
 * @returns {Network | undefined} The corresponding network enum or undefined if not found.
 */
export const getNetworkByChainId = (chainId: number): Network | undefined => {
  for (const [network, chain] of Object.entries(CHAINS)) {
    if (chain.chainId === chainId) {
      return network as Network;
    }
  }
  return undefined;
};

/**
 * Zero address constant used for both Ethereum and Tron networks.
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
