import { BrowserProvider } from "ethers";
import TronWeb from "tronweb";
import MetamaskWalletService from "../services/wallets/MetamaskWalletService";
import { IWalletService } from "../types/IWalletService";

/**
 * Defines a flexible provider type for different blockchain wallets.
 */
export type WalletProvider = BrowserProvider | TronWeb | null;

/**
 * Enum representing supported wallet types.
 */
export enum WalletType {
    MetaMask = 'metamask',
    TronLink = 'tronlink',
    WalletConnect = 'walletconnect',
  }
  
  /**
   * Interface for dynamically loading wallet hooks.
   */
  export interface WalletConfig {
    name: string;
    icon: string;
    website: string;
    service?: IWalletService ; // Path to the corresponding wallet hook
  }
  
  /**
   * Mapping of supported wallet types to their configuration.
   */
  export const WALLETS: Record<WalletType, WalletConfig> = {
    [WalletType.MetaMask]: {
      name: 'MetaMask',
      icon: '/icons/MetaMask.svg',
      website: 'https://metamask.io/',
      service: MetamaskWalletService,
    },
    [WalletType.TronLink]: {
      name: 'TronLink',
      icon: '/icons/TronLink.png',
      website: 'https://tronlink.org/',
      service: undefined,
    },
    [WalletType.WalletConnect]: {
      name: 'WalletConnect',
      icon: '/icons/walletconnect.svg',
      website: 'https://walletconnect.com/',
      service: undefined, // Example for new wallet integration
    },
  };