import { useState, useCallback, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { useUserStore } from '../store/useUserStore';
import { useErrorHandler } from './useErrorHandler';
import { useTranslation } from 'react-i18next';
import { useFlashMessage } from './useFlashMessage';

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
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const { showFlashMessage } = useFlashMessage();

  // Translation keys
  const translationErrors = 'wallets.metamask.errors';
  const translationWarnings = 'wallets.metamask.warnings';
  const translationNotifications = 'wallets.metamask.notifications';

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
        showFlashMessage(t(`${translationWarnings}.account_disconnected`), 'warning');
        resetConnection(); // Call reset when account is disconnected
      }
    };

    const handleDisconnect = () => {
      console.log('MetaMask disconnected');
      showFlashMessage(t(`${translationWarnings}.disconnected`), 'warning');
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
  }, [address, connectedNetwork, ethereum, provider, resetConnection, showFlashMessage, t]);

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

          showFlashMessage(t(`${translationNotifications}.connected`, { account: accounts[0] }), 'success');
        } else {
          showFlashMessage(t(`${translationErrors}.no_accounts`), 'warning');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          handleError(error, true, t(`${translationErrors}.connection_error`, { error: error.message }));
          return error.message;
        }

        handleError(t(`${translationErrors}.unknown_error`));
      }
    } else {
      handleError(t(`${translationErrors}.not_installed`));
    }
  }, [handleError, setConnectedNetwork, showFlashMessage, t]);

  return { provider, connectEthereum };
};
