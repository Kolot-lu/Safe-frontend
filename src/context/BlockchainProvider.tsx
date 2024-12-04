import React, { createContext, useCallback, useEffect, useMemo } from 'react';
import { BrowserProvider, Signer } from 'ethers';
import TronWeb from 'tronweb';
import { useTranslation } from 'react-i18next';
import { useEthereum } from '../hooks/useEthereum';
import { useTron } from '../hooks/useTron';
import { useContractService } from '../hooks/useContractService';
import { IBlockchainContractService } from '../types';
import { useUserStore } from '../store/useUserStore';
import { useErrorHandler } from '../hooks/useErrorHandler';
import capitalize from '../helpers/capitalize';

/**
 * Interface describing the context data available to consuming components
 */
export interface BlockchainContextProps {
  provider: BrowserProvider | null;
  tronWeb: TronWeb | null;
  contractService: IBlockchainContractService | null;
  signer: Signer | null;
  connectEthereum: () => void;
  connectTron: () => void;
  switchNetwork: (network: 'ethereum' | 'tron') => void;
}

/**
 * Create a BlockchainContext with default value as null.
 * This will be used to pass the blockchain state and actions to the rest of the app.
 */
export const BlockchainContext = createContext<BlockchainContextProps | null>(null);

/**
 * BlockchainProvider component is responsible for managing:
 * - Wallet connections (Ethereum or Tron)
 * - Contract service initialization based on the connected blockchain
 * - Managing network switching
 */
export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setConnectedNetwork, resetConnection, connectedNetwork, address } = useUserStore();
  const { provider, connectEthereum } = useEthereum();
  const { tronWeb, connectTron } = useTron();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  // Translation keys
  const translationErrors = 'blockchain_provider.errors';

  // State to hold the Ethereum signer
  const [signer, setSigner] = React.useState<Signer | null>(null);

  useEffect(() => {
    const getSigner = async () => {
      if (provider) {
        const signer = await provider.getSigner();
        setSigner(signer);
      }
    };
    getSigner();
  }, [provider]);

  /**
   * Effect to restore the user's connected network and address from Zustand state on component mount.
   * Ensures the appropriate provider (Ethereum or Tron) is initialized, or resets the connection if invalid.
   */
  useEffect(() => {
    // Skip if no network or address is available
    // No network or address available to restore, skipping reset
    if (!connectedNetwork || !address) return;

    // Handle Ethereum restoration
    if (connectedNetwork === 'ethereum') {
      // Waiting for Ethereum provider to be initialized
      if (!provider) return;

      setConnectedNetwork('ethereum', address);
      return;
    }

    // Handle Tron restoration
    if (connectedNetwork === 'tron') {
      // Waiting for TronWeb to be initialized
      if (!tronWeb) return;

      setConnectedNetwork('tron', address);
      return;
    }

    // Reset connection if none of the conditions are met
    resetConnection();
  }, [address, connectedNetwork, provider, resetConnection, setConnectedNetwork, t, tronWeb]);

  /**
   * Memoized function for switching between networks (Ethereum or Tron).
   * Ensures that the network switch occurs only if the corresponding provider is available.
   */
  const switchNetwork = useCallback(
    async (network: 'ethereum' | 'tron') => {
      if (network === 'ethereum') {
        if (!provider) return handleError(t(`${translationErrors}.missing_provider`, { network: capitalize(network) }));
        return setConnectedNetwork('ethereum', (await provider.getSigner()).address);
      }

      if (network === 'tron') {
        if (!tronWeb) return handleError(t(`${translationErrors}.missing_provider`, { network: capitalize(network) }));
        return setConnectedNetwork('tron', tronWeb.defaultAddress.base58);
      }
    },
    [handleError, provider, setConnectedNetwork, t, tronWeb]
  );

  // Initialize contract service based on the connected network
  const contractService = useContractService(
    connectedNetwork === 'ethereum' ? provider : null,
    connectedNetwork === 'tron' ? tronWeb : null,
    connectedNetwork || 'ethereum' // Default to ethereum if null
  );

  /**
   * Memoize the context value to prevent unnecessary re-renders.
   * The value will only be recalculated when its dependencies change.
   */
  const contextValue = useMemo(
    () => ({
      provider,
      tronWeb,
      signer,
      contractService,
      connectEthereum,
      connectTron,
      switchNetwork,
    }),
    [provider, tronWeb, signer, contractService, connectEthereum, connectTron, switchNetwork]
  );

  /**
   * Return the provider with the memoized context value.
   * This allows child components to consume the context efficiently.
   */
  return <BlockchainContext.Provider value={contextValue}>{children}</BlockchainContext.Provider>;
};
