import { useState, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

/**
 * Hook to manage Ethereum wallet connection.
 * Provides a provider and a method to connect to Ethereum through MetaMask.
 */
export const useEthereum = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

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
          console.log(`Connected to account: ${accounts[0]}`);
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
  }, []);

  return { provider, connectEthereum };
};
