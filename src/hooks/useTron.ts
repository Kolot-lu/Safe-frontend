import { useState, useCallback } from 'react';
import TronWeb from 'tronweb';

/**
 * Hook to manage Tron wallet connection.
 * Provides a TronWeb instance and a method to connect to Tron via TronLink.
 */
export const useTron = () => {
  const [tronWeb, setTronWeb] = useState<TronWeb | null>(null);

  /**
   * Attempts to connect to the Tron wallet using TronLink.
   * If successful, sets the tronWeb instance in the state.
   */
  const connectTron = useCallback((): void => {
    if (window.tronWeb && window.tronWeb.ready) {
      setTronWeb(window.tronWeb);
      console.log('Connected to TronLink');
    } else {
      console.error('TronLink is not installed or not ready!');
    }
  }, []);

  return { tronWeb, connectTron };
};
