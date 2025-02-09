import { BrowserProvider } from 'ethers';
import { getNetworkByChainId } from '../../config/chains';
import { WalletType } from '../../config/wallets';
import { IWalletService, WalletEvent } from '../../types/IWalletService';
import { shortenAddress } from '../../helpers/shortenAddress';

/**
 * Defines the structure of an Ethereum provider with event handling.
 * This is a subset of the EIP-1193 provider interface from ethers.js.
 */
interface EthereumProviderWithEvents {
  request: (args: { method: string }) => Promise<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, handler: (...args: any[]) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

/**
 * MetaMask Wallet Service
 * Manages MetaMask connection, provider access, and event subscriptions.
 */
const MetamaskWalletService: IWalletService = {
  /**
   * Connects to MetaMask and retrieves account & network details.
   */
  connect: async () => {
    if (!window.ethereum) {
      throw new Error('wallets.metamask.errors.no_metamask_provider');
    }

    const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
      throw new Error('wallets.metamask.errors.no_accounts');
    }

    const browserProvider = new BrowserProvider(window.ethereum);
    const networkResult = await browserProvider.getNetwork();
    const detectedNetwork = getNetworkByChainId(Number(networkResult.chainId));

    if (!detectedNetwork) {
      throw new Error('wallets.metamask.errors.unsupported_network');
    }

    return {
      provider: browserProvider,
      address: accounts[0],
      network: detectedNetwork,
      walletType: WalletType.MetaMask,
    };
  },

  /**
   * Retrieves the current MetaMask provider.
   */
  getProvider: (): BrowserProvider | null => (window.ethereum ? new BrowserProvider(window.ethereum) : null),

  /**
   * Subscribes to MetaMask events.
   * @param handleWalletEvent - Function to handle wallet events.
   * @returns Event handler functions for unsubscribing.
   */
  subscribeEvents: (handleWalletEvent: (events: WalletEvent | WalletEvent[]) => void) => {
    if (!window.ethereum) return null;

    const boundHandlers = {
      handleAccountsChanged: (accounts: string[]) => eventHandlers.handleAccountsChanged(accounts, handleWalletEvent),
      handleChainChanged: (chainId: string) => eventHandlers.handleChainChanged(chainId, handleWalletEvent),
      handleDisconnect: () => eventHandlers.handleDisconnect(handleWalletEvent),
    };

    (window.ethereum as EthereumProviderWithEvents).on('accountsChanged', boundHandlers.handleAccountsChanged);
    (window.ethereum as EthereumProviderWithEvents).on('chainChanged', boundHandlers.handleChainChanged);
    (window.ethereum as EthereumProviderWithEvents).on('disconnect', boundHandlers.handleDisconnect);

    return boundHandlers;
  },

  /**
   * Unsubscribes from MetaMask events.
   * @param handlers - Object containing event handlers.
   */
  unsubscribeEvents: (handlers?: {
    handleAccountsChanged: (accounts: string[]) => void;
    handleChainChanged: (chainId: string) => void;
    handleDisconnect: () => void;
  }) => {
    if (!window.ethereum || !handlers) return;

    (window.ethereum as EthereumProviderWithEvents).removeListener('accountsChanged', handlers.handleAccountsChanged);
    (window.ethereum as EthereumProviderWithEvents).removeListener('chainChanged', handlers.handleChainChanged);
    (window.ethereum as EthereumProviderWithEvents).removeListener('disconnect', handlers.handleDisconnect);
  },
};

/**
 * Event Handlers for MetaMask
 * Handles blockchain events such as account changes, network switches, and disconnections.
 */
const eventHandlers = {
  /**
   * Handles account change event.
   * @param accounts - List of accounts from MetaMask.
   * @param handleWalletEvent - Function to handle wallet events.
   */
  handleAccountsChanged: async (
    accounts: string[],
    handleWalletEvent: (events: WalletEvent | WalletEvent[]) => void
  ) => {
    if (accounts.length === 0) {
      return handleWalletEvent([
        { action: 'resetConnection' },
        { action: 'showMessage', payload: { message: 'wallets.metamask.warnings.disconnected', type: 'warning' } },
      ]);
    }

    try {
      const chainIdHex = await window.ethereum!.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      const detectedNetwork = getNetworkByChainId(chainId);

      if (detectedNetwork) {
        return handleWalletEvent([
          { action: 'setConnectedNetwork', payload: { address: accounts[0], network: detectedNetwork } },
          {
            action: 'showMessage',
            payload: {
              translation: {
                key: 'wallets.metamask.notifications.account_changed',
                variables: { account: shortenAddress(accounts[0]) },
              },
              type: 'success',
            },
          },
        ]);
      }

      return handleWalletEvent([
        {
          action: 'showMessage',
          payload: { message: 'wallets.metamask.errors.unsupported_network', type: 'warning' },
        },
      ]);
    } catch (error) {
      console.error('Error handling account change:', error);
    }
  },

  /**
   * Handles chain change event.
   * @param chainId - The new chain ID.
   * @param handleWalletEvent - Function to handle wallet events.
   */
  handleChainChanged: async (chainId: string, handleWalletEvent: (events: WalletEvent | WalletEvent[]) => void) => {
    try {
      const decimalChainId = parseInt(chainId, 16);
      const detectedNetwork = getNetworkByChainId(decimalChainId);
      const accounts: string[] = await window.ethereum!.request({ method: 'eth_accounts' });
      const address = accounts[0];

      if (detectedNetwork) {
        return handleWalletEvent([
          { action: 'setConnectedNetwork', payload: { network: detectedNetwork, address } },
          {
            action: 'showMessage',
            payload: {
              translation: {
                key: 'wallets.metamask.notifications.network_switched',
                variables: { network: detectedNetwork },
              },
              type: 'success',
            },
          },
        ]);
      }

      return handleWalletEvent([
        {
          action: 'showMessage',
          payload: { message: 'wallets.metamask.errors.unsupported_network', type: 'warning' },
        },
      ]);
    } catch (error) {
      console.error('Error handling chain change:', error);
    }
  },

  /**
   * Handles disconnect event.
   * @param handleWalletEvent - Function to handle wallet events.
   */
  handleDisconnect: (handleWalletEvent: (events: WalletEvent | WalletEvent[]) => void) => {
    return handleWalletEvent([
      { action: 'showMessage', payload: { message: 'wallets.metamask.warnings.disconnected', type: 'warning' } },
      { action: 'resetConnection' },
    ]);
  },
};

export default MetamaskWalletService;
