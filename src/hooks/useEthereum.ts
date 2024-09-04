import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { useUserStore } from '../store/useUserStore';

/**
 * Interface describing the Ethereum provider with event handling.
 * This is a subset of the Eip1193Provider interface from ethers.js.
 */
interface EthereumProviderWithEvents {
  request: (args: { method: string }) => Promise<string[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (event: string, handler: (...args: any[]) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

/**
 * Hook to manage Ethereum wallet connection.
 * Provides a provider and a method to connect to Ethereum through MetaMask.
 */
export const useEthereum = () => {
  const ethereum = window.ethereum as unknown as EthereumProviderWithEvents;
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const { setConnectedNetwork, resetConnection, address, connectedNetwork } = useUserStore();

  /**
   * Effect to restore the Ethereum provider only if necessary.
   * Ensures that the provider is not recreated if it already exists or is being set.
   */
  useEffect(() => {
    // Restore the Ethereum provider only if connected to the Ethereum network and an address is available
    if (connectedNetwork === 'ethereum' && address && window.ethereum && !provider) {
      const browserProvider = new BrowserProvider(window.ethereum);
      setProvider(browserProvider);
    }

    // Listen for account changes or disconnection
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log('MetaMask account disconnected');
        resetConnection(); // Call reset when account is disconnected
      }
    };

    const handleDisconnect = () => {
      console.log('MetaMask disconnected');
      resetConnection(); // Call reset when MetaMask is disconnected
    };

    // Subscribe to MetaMask events directly
    if (window.ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('disconnect', handleDisconnect);
    }

    // Cleanup event listeners on unmount
    return () => {
      if (window.ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [address, connectedNetwork, ethereum, provider, resetConnection]);

  /**
   * Attempts to connect to the Ethereum wallet using MetaMask.
   * If successful, sets the provider state.
   *
   * @returns {Promise<void | string>} Resolves to void on success, or an error code string on failure.
   */
  const connectEthereum = useCallback(async (): Promise<void | string> => {
    if (window.ethereum) {
      try {
        // Request the user to connect their Ethereum wallet via MetaMask
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        if (accounts && accounts.length > 0) {
          const browserProvider = new BrowserProvider(window.ethereum);
          setProvider(browserProvider);
          setConnectedNetwork('ethereum', accounts[0]);

          console.log(`Connected to account: ${accounts[0]}`, 'ethereum');
        } else {
          console.warn('No Ethereum accounts found.');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Ethereum connection error: ${error.message}`);
          return error.message;
        }
        console.error('Unknown Ethereum connection error');
      }
    } else {
      console.error('MetaMask is not installed!');
    }
  }, [setConnectedNetwork]);

  return { provider, connectEthereum };
};
