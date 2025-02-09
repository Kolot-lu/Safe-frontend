import { useContext } from 'react';
import { BlockchainContext, BlockchainContextProps } from '../context/BlockchainProvider';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from './useErrorHandler';

/**
 * Hook to consume the BlockchainContext.
 * Throws an error if the hook is used outside of BlockchainProvider.
 *
 * @returns {BlockchainContextProps} Blockchain context properties and actions.
 * {BlockchainContextProps}:
 * - contractService: Contract service instance for the active provider
 * - walletType: The active wallet type (MetaMask | TronLink ...)
 * - network: The active network (EVM | TRON...)
 * - getTokens: Function to retrieve tokens for a given network (or the connected network by default)
 * - connectWallet: Function to connect a wallet based on the provided wallet type
 * - switchNetwork: Function to switch the active network
 *
 * @example
 * const { metamaskProvider, tronWebProvider, contractService, connectWallet } = useBlockchain();
 */
export const useBlockchain = (): BlockchainContextProps => {
  const context = useContext(BlockchainContext);
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  if (!context) throw handleError(new Error(t('hooks.use_blockchain.errors.no_provider')));

  return context;
};
