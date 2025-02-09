import { BrowserProvider } from 'ethers';
import TronWeb from 'tronweb';
import { EthereumContractService } from '../services/EthereumContractService';
import { TronContractService } from '../services/TronContractService';
import { IBlockchainContractService } from '../types';
import { AppProviders } from '../config/chains';

/**
 * Factory function to create a blockchain contract service.
 * Based on the blockchain type (Ethereum or Tron), this function returns the corresponding service.
 *
 * @param {AppProviders | null} provider - The provider instance for the blockchain.
 * @returns {IBlockchainContractService} The contract service for the specified blockchain.
 * @throws Will throw an error if an unsupported blockchain or missing provider is passed.
 */
export function createContractService(provider: AppProviders | null): IBlockchainContractService {
  // Ensure that the provider is available.
  if (!provider) throw new Error('Missing provider');

  if (provider instanceof BrowserProvider) return new EthereumContractService(provider);

  if (provider instanceof TronWeb) return new TronContractService(provider);

  throw new Error('Unsupported blockchain type');
}
