import { useContext } from 'react';
import { BlockchainContext, BlockchainContextProps } from '../context/BlockchainProvider';

/**
 * Hook to consume the BlockchainContext. 
 * Throws an error if the hook is used outside of BlockchainProvider.
 *
 * @returns {BlockchainContextProps} Blockchain context properties and actions.
 */
export const useBlockchain = (): BlockchainContextProps => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};
