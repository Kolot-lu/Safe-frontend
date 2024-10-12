import { useState, useCallback, useEffect } from 'react';
import TronWeb from 'tronweb';
import { useUserStore } from '../store/useUserStore';
import { useErrorHandler } from './useErrorHandler';
import { useTranslation } from 'react-i18next';
import { useFlashMessage } from './useFlashMessage';

/**
 * Hook to manage Tron wallet connection.
 * Provides a TronWeb instance and a method to connect to Tron via TronLink.
 */
export const useTron = () => {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const { setConnectedNetwork, resetConnection, address, connectedNetwork } = useUserStore();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const { showFlashMessage } = useFlashMessage();

  // Translation keys
  const translationErrors = 'wallets.tronweb.errors';
  const translationWarnings = 'wallets.tronweb.warnings';
  const translationNotifications = 'wallets.tronweb.notifications';

  /**
   * Effect to restore Tron connection if it's already connected.
   */
  useEffect(() => {
    if (connectedNetwork === 'tron' && address && window.tronWeb && !tronWeb) {
      setTronWeb(window.tronWeb);
      showFlashMessage(t(`${translationNotifications}.restored_connection`, { account: address }));
    }

    const handleAccountChanged = (newAddress: string) => {
      if (!newAddress) {
        showFlashMessage(t(`${translationWarnings}.account_disconnected`), 'warning');
        resetConnection(); // Reset connection when account is disconnected
      } else {
        setConnectedNetwork('tron', newAddress);
        showFlashMessage(t(`${translationNotifications}.account_changed`, { account: newAddress }));
      }
    };

    const handleDisconnect = () => {
      showFlashMessage(t(`${translationWarnings}.disconnected`), 'warning');
      resetConnection(); // Reset connection when TronLink is disconnected
    };

    // Subscribe to TronLink events
    if (window.tronWeb && window.tronWeb.ready) {
      window.tronWeb.on('addressChanged', handleAccountChanged);
      window.tronWeb.on('disconnect', handleDisconnect);
    }

    // Cleanup event listeners on unmount
    return () => {
      if (window.tronWeb) {
        window.tronWeb.removeListener('addressChanged', handleAccountChanged);
        window.tronWeb.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [address, connectedNetwork, tronWeb, resetConnection, setConnectedNetwork, showFlashMessage, t]);

  /**
   * Attempts to connect to the Tron wallet using TronLink.
   * If successful, sets the tronWeb instance in the state and saves the connection data in localStorage.
   */
  const connectTron = useCallback((): void => {
    if (window.tronWeb && window.tronWeb.ready) {
      setTronWeb(window.tronWeb);
      setConnectedNetwork('tron', window.tronWeb.defaultAddress.base58);
      
      showFlashMessage(
        t(`${translationNotifications}.connected`, { account: window.tronWeb.defaultAddress.base58 }),
        'success'
      );
    } else {
      handleError(t(`${translationErrors}.not_installed`));
    }
  }, [handleError, setConnectedNetwork, showFlashMessage, t]);

  return { tronWeb, connectTron };
};
