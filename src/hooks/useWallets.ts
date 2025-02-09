import { useState, useEffect, useCallback, useRef } from 'react';
import { WalletType, WALLETS, WalletProvider } from '../config/wallets';
import { useUserStore } from '../store/useUserStore';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useFlashMessage } from '../hooks/useFlashMessage';
import { useTranslation } from 'react-i18next';
import { IWalletService, WalletEvent } from '../types/IWalletService';
import { shortenAddress } from '../helpers/shortenAddress';

/**
 * Hook for dynamically managing wallet connections.
 * Supports various wallets, listens for events, and updates global state.
 */
export const useWallets = () => {
  const { setConnectedNetwork, resetConnection, wallet, address } = useUserStore();
  const { handleError } = useErrorHandler();
  const { showFlashMessage } = useFlashMessage();
  const { t } = useTranslation();

  // List of detected wallets
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
  // Current provider instance
  const [provider, setProvider] = useState<WalletProvider>(null);

  // Retrieve the current wallet service
  const walletService: IWalletService | null = wallet ? WALLETS[wallet]?.service ?? null : null;
  // Store event handlers for proper cleanup
  const eventHandlersRef = useRef<ReturnType<IWalletService['subscribeEvents']> | null>(null);

  /**
   * Detects available wallets dynamically from `WALLETS` config.
   */
  useEffect(() => {
    const detectedWallets = Object.keys(WALLETS).filter((wallet) => WALLETS[wallet as WalletType].service);
    setAvailableWallets(detectedWallets as WalletType[]);

    if (wallet && address && !provider) {
      const newProvider = WALLETS[wallet].service?.getProvider();
      if (newProvider) setProvider(newProvider);
    }
  }, [address, provider, wallet]);

  /**
   * Handles wallet-related events dynamically.
   * Supports multiple events in a single call.
   */
  const handleWalletEvent = useCallback(
    (events: WalletEvent | WalletEvent[]) => {
      const eventList = Array.isArray(events) ? events : [events];

      eventList.forEach(({ action, payload }) => {
        switch (action) {
          case 'showMessage':
            if (payload) {
              const message = payload.translation
                ? t(payload.translation.key, payload.translation.variables)  // Use translation if available
                : payload.message;  // Fallback to plain message if provided
      
              if (message) {
                showFlashMessage(message, payload.type);
              }
            }
            break;
          case 'setConnectedNetwork':
            if (payload?.network && payload?.address) {
              setConnectedNetwork(payload.network, payload.address, wallet as WalletType);
            }
            break;
          case 'resetConnection':
            resetConnection();
            break;
          default:
            console.warn('⚠️ Unknown wallet event:', action, payload);
        }
      });
    },
    [resetConnection, showFlashMessage, setConnectedNetwork, t, wallet]
  );

  /**
   * Connects to a selected wallet.
   * @param walletType - The wallet type to connect to.
   */
  const connectWallet = useCallback(
    async (walletType: WalletType) => {
      try {
        const service = WALLETS[walletType]?.service;
        if (!service) throw handleError(t(`wallets.errors.unsupported_wallet`, {wallet: walletType}));

        const { provider, address, network } = await service.connect();
        setProvider(provider);
        setConnectedNetwork(network, address, walletType);

        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

        showFlashMessage(
          t(`wallets.notifications.connected`, { wallet: capitalize(walletType), account: shortenAddress(address) }),
          'success'
        );

        // Cleanup old subscriptions before subscribing again
        if (eventHandlersRef.current) {
          service.unsubscribeEvents(eventHandlersRef.current);
        }

        // Subscribe to new events
        eventHandlersRef.current = service.subscribeEvents(handleWalletEvent);
      } catch (error: unknown) {
        if (error instanceof Error) {
          const [errorKey, errorParam] = error.message.split('|');
          handleError(t(errorKey, { value: errorParam }));
        }
      }
    },
    [setConnectedNetwork, showFlashMessage, t, handleWalletEvent, handleError]
  );

  /**
   * Subscribes to wallet events when the wallet is connected.
   * Ensures old subscriptions are cleaned up.
   */
  useEffect(() => {
    if (wallet && walletService) {

      // Unsubscribe from old handlers before re-subscribing
      if (eventHandlersRef.current) {
        walletService.unsubscribeEvents(eventHandlersRef.current);
      }

      eventHandlersRef.current = walletService.subscribeEvents(handleWalletEvent);

      return () => {
        if (eventHandlersRef.current) {
          walletService.unsubscribeEvents(eventHandlersRef.current);
        }
      };
    }
  }, [wallet, handleWalletEvent, walletService]);

  return { availableWallets, connectedWallet: wallet, connectWallet, provider };
};
