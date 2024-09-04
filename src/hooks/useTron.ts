import { useState, useCallback, useEffect } from 'react';
import TronWeb from 'tronweb';
import { useUserStore } from '../store/useUserStore';

/**
 * Hook to manage Tron wallet connection.
 * Provides a TronWeb instance and a method to connect to Tron via TronLink.
 */
export const useTron = () => {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);
  const { setConnectedNetwork, resetConnection, address, connectedNetwork } = useUserStore();

  /**
   * Effect to restore TronLink connection if it's already connected.
   */
  useEffect(() => {
    if (connectedNetwork === 'tron' && address && window.tronWeb && !tronWeb) {
      setTronWeb(window.tronWeb);
      console.log(`Restored TronLink connection for account: ${address}`);
    }

    const handleAccountChanged = (newAddress: string) => {
      if (!newAddress) {
        console.log('TronLink account disconnected');
        resetConnection(); // Reset connection when account is disconnected
      } else {
        setConnectedNetwork('tron', newAddress);
        console.log(`Switched to account: ${newAddress}`);
      }
    };

    const handleDisconnect = () => {
      console.log('TronLink disconnected');
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
  }, [address, connectedNetwork, tronWeb, resetConnection, setConnectedNetwork]);


  /**
   * Attempts to connect to the Tron wallet using TronLink.
   * If successful, sets the tronWeb instance in the state and saves the connection data in localStorage.
   */
  const connectTron = useCallback((): void => {
    if (window.tronWeb && window.tronWeb.ready) {
      setTronWeb(window.tronWeb);
      setConnectedNetwork("tron", window.tronWeb.defaultAddress.base58);

      console.log(`Connected to TronLink with account: ${window.tronWeb.defaultAddress.base58}`);
    } else {
      console.error('TronLink is not installed or not ready!');
    }
  }, [setConnectedNetwork]);

  return { tronWeb, connectTron };
};
