import { BrowserProvider } from 'ethers';
import TronWeb from 'tronweb';
import { EthereumContractService } from '../services/EthereumContractService';
import { TronContractService } from '../services/TronContractService';
import { IBlockchainContractService } from '../types';

/**
 * Factory function to create a blockchain contract service.
 * Based on the blockchain type (Ethereum or Tron), this function returns the corresponding service.
 *
 * @param {TronWeb | null} tronWeb - The instance of TronWeb (for Tron-based contracts).
 * @param {'ethereum' | 'tron'} blockchainType - The type of blockchain ('ethereum' or 'tron').
 * @param {BrowserProvider | null} [provider] - The provider for Ethereum (optional).
 * @returns {IBlockchainContractService} The contract service for the specified blockchain.
 * @throws Will throw an error if an unsupported blockchain or missing provider is passed.
 */
export function createContractService(
  tronWeb: TronWeb | null,
  blockchainType: 'ethereum' | 'tron',
  provider?: BrowserProvider | null
): IBlockchainContractService {
  // Ensure that the provider is available for Ethereum and tronWeb for Tron.
  switch (blockchainType) {
    case 'ethereum':
      if (provider) {
        return new EthereumContractService(provider);
      } else {
        throw new Error('Ethereum provider is missing');
      }

    case 'tron':
      if (tronWeb) {
        return new TronContractService(tronWeb);
      } else {
        throw new Error('TronWeb instance is missing');
      }

    default:
      throw new Error('Unsupported blockchain type');
  }
}
