import React, { createContext, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/useUserStore';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { Network, CHAINS, NetworkType } from '../config/chains';
import { WalletType, WALLETS } from '../config/wallets';
import { useContractService } from '../hooks/useContractService';
import { useWallets } from '../hooks/useWallets';
import { Token } from '../config/tokens';
import config from '../config';
import TronWeb from 'tronweb';
import { BrowserProvider } from 'ethers';

/**
 * @interface BlockchainContextProps
 * @description Defines the structure of the blockchain context.
 */
export interface BlockchainContextProps {
  contractService: ReturnType<typeof useContractService> | null; // Contract service instance for the active provider
  walletType: WalletType | null;                                 // The active wallet type (MetaMask | TronLink ...)
  network: Network | null;                                       // The active network (EVM | TRON...)
  getTokens: (network?: Network) => Promise<Token[]>;            // Function to retrieve tokens for a given network (or the connected network by default)
  connectWallet: (wallet: WalletType) => void;                   // Function to connect a wallet based on the provided wallet type
  switchNetwork: (network: Network) => void;                     // Function to switch the active network
}

/**
 * @constant BlockchainContext
 * @description Provides blockchain-related state and functions across the application.
 */
export const BlockchainContext = createContext<BlockchainContextProps | null>(null);

/**
 * BlockchainProvider component manages blockchain interactions, including:
 * - Wallet connections (MetaMask, TronLink, etc.)
 * - Network switching (EVM, TRON, and more)
 * - Contract service initialization
 */
export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connectedNetwork, address, wallet, setConnectedNetwork, resetConnection } = useUserStore();
  const { connectWallet, provider, connectedWallet } = useWallets();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  /**
   * Restores the previous wallet connection.
   * Ensures that the wallet provider is available and valid.
   */
  useEffect(() => {
    const restoreConnection = async () => {
      if (!connectedNetwork || !address || !wallet) return;

      const networkConfig = CHAINS[connectedNetwork];
      if (!networkConfig) return resetConnection();

      // Check EVM networks (Ethereum, Polygon, etc.)
      if (networkConfig.type === NetworkType.EVM) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof (provider as any).listAccounts === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const accounts = await (provider as any).listAccounts();
            if (!accounts || accounts.length === 0) return resetConnection();
          } else {
            const signer = await (provider as BrowserProvider).getSigner();
            const address = await signer.getAddress();
            if (!address) return resetConnection();
          }
        } catch {
          return resetConnection();
        }
      }

      // Check Tron networks
      if (networkConfig.type === NetworkType.TRON) {
        try {
          // TronWeb provider must be initialized and have a default address
          if (!provider || !(provider as TronWeb).ready || !(provider as TronWeb).defaultAddress.base58) {
            return resetConnection();
          }
        } catch {
          return resetConnection();
        }
      }

      // Future networks (e.g., Solana, Near) can be added here

      // Restore connection
      setConnectedNetwork(connectedNetwork, address, wallet);
    };

    if(provider) restoreConnection();
    if(!provider && connectedWallet) connectWallet(connectedWallet);
    if(!provider && !connectedWallet) resetConnection();

  }, [connectedNetwork, address, wallet, setConnectedNetwork, resetConnection, provider, connectedWallet, connectWallet]);

  /**
   * Retrieves the token list for a given network.
   * Defaults to the connected network if none is provided.
   *
   * @param network - (Optional) The network for which to get tokens.
   * @returns A promise resolving to an array of tokens.
   */
  const getTokens = useCallback(
    async (network?: Network): Promise<Token[]> => {
      const targetNetwork = network || connectedNetwork;
      if (!targetNetwork) return [];

      try {
        return config.tokens[targetNetwork] || [];
      } catch (error) {
        handleError(error);
        return [];
      }
    },
    [connectedNetwork, handleError]
  );

  /**
   * Switches to the selected network.
   * @param {Network} network - The network to switch to.
   */
  const switchNetwork = useCallback(
    async (network: Network) => {
      const networkConfig = CHAINS[network];

      if (!networkConfig) {
        return handleError(t('blockchain_provider.errors.invalid_network', { network }));
      }

      if (!wallet || !networkConfig.supportedWallets.includes(wallet)) {
        return handleError(
          t('blockchain_provider.errors.wallet_not_supported', {
            wallet: wallet ? WALLETS[wallet].name : 'Unknown',
            network,
          })
        );
      }

      try {
        // const provider = WALLETS[wallet].getProvider();
        if (!provider) return handleError(t('blockchain_provider.errors.missing_provider', { network }));

        setConnectedNetwork(network, address || '', wallet);
      } catch (error) {
        handleError(error);
      }
    },
    [wallet, handleError, t, provider, setConnectedNetwork, address]
  );

  // Initialize contract service based on the connected provider.
  const contractService = useContractService(wallet && provider ? provider : null);

  /**
   * Memoizes the context value to avoid unnecessary re-renders.
   */
  const contextValue = useMemo(
    () => ({
      contractService,
      walletType: wallet,
      network: connectedNetwork,
      getTokens,
      connectWallet,
      switchNetwork,
    }),
    [contractService, wallet, connectedNetwork, getTokens, connectWallet, switchNetwork]
  );

  return <BlockchainContext.Provider value={contextValue}>{children}</BlockchainContext.Provider>;
};
