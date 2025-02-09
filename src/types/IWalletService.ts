import { Network } from '../config/chains';
import { WalletProvider, WalletType } from '../config/wallets';

/**
 * Defines the structure for wallet-related event handling.
 */
export interface WalletEvent {
  action: 'showMessage' | 'setConnectedNetwork' | 'resetConnection';
  payload?: {
    message?: string;
    type?: 'success' | 'error' | 'info' | 'warning' | undefined;
    network?: Network;
    address?: string;
    translation?: {
      key: string;
      variables?: Record<string, string | number>;
    };
  };
}

/**
 * Interface that all wallet services must implement.
 */
export interface IWalletService {
  /** Connects to the wallet and returns the provider, address, and network details. */
  connect: () => Promise<{
    provider: WalletProvider;
    address: string;
    network: Network;
    walletType: WalletType;
  }>;

  /** Retrieves the provider instance for this wallet. */
  getProvider: () => WalletProvider;

  /** Subscribes to wallet events and passes them to the central event handler. */
  subscribeEvents: (handleEvent: (events: WalletEvent | WalletEvent[]) => void) => void;

  /** Unsubscribes from wallet events. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unsubscribeEvents: (handlers: any) => void;
}
