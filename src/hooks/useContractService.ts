import { useMemo } from 'react';
import { createContractService } from '../factories/ContractServiceFactory';
import { IBlockchainContractService } from '../types';
import { AppProviders } from '../config/chains';

/**
 * Hook to initialize contract service based on the connected blockchain.
 * Provides access to contract methods (e.g., project creation, fetching projects).
 *
 * @param {AppProviders | null} provider - The blockchain provider instance.
 * @returns {IBlockchainContractService | null} - The contract service instance or null if not connected.
 */
export const useContractService = (provider: AppProviders | null): IBlockchainContractService | null => {
  return useMemo(() => {
    if (!provider) return null;

    return createContractService(provider);
  }, [provider]);
};
