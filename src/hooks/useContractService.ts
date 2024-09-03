import { useMemo } from 'react';
import { BrowserProvider } from 'ethers';
import TronWeb from 'tronweb';
import { createContractService } from '../factories/ContractServiceFactory';
import { IBlockchainContractService } from '../types';

/**
 * Hook to initialize contract service based on the connected blockchain.
 * Provides access to contract methods (e.g., project creation, fetching projects).
 *
 * @param {BrowserProvider | null} provider - Ethereum provider (if connected via MetaMask).
 * @param {TronWeb | null} tronWeb - TronWeb instance (if connected via TronLink).
 * @param {'ethereum' | 'tron'} blockchainType - The blockchain type.
 * @returns {IBlockchainContractService | null} - The contract service instance or null if not connected.
 */
export const useContractService = (
  provider: BrowserProvider | null,
  tronWeb: TronWeb | null,
  blockchainType: 'ethereum' | 'tron'
): IBlockchainContractService | null => {
  return useMemo(() => {
    if (blockchainType && (provider || tronWeb)) {
      return createContractService(tronWeb, blockchainType, provider);
    }
    return null;
  }, [provider, tronWeb, blockchainType]);
};
