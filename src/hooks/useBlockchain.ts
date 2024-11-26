import { useContext } from 'react';
import { BlockchainContext, BlockchainContextProps } from '../context/BlockchainProvider';
import { useTranslation } from 'react-i18next';
import { useErrorHandler } from './useErrorHandler';

/**
 * Hook to consume the BlockchainContext.
 * Throws an error if the hook is used outside of BlockchainProvider.
 *
 * @returns {BlockchainContextProps} Blockchain context properties and actions.
 * 
 * @example
 * const { provider, tronWeb, contractService, connectEthereum, connectTron, switchNetwork } = useBlockchain();
 */
export const useBlockchain = (): BlockchainContextProps => {
  const context = useContext(BlockchainContext);
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  if (!context) throw handleError(new Error(t('hooks.use_blockchain.errors.no_provider')));

  return context;
};
