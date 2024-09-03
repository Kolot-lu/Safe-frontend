import React, { createContext, useMemo } from 'react';
import { useEthereum } from '../hooks/useEthereum';
import { useTron } from '../hooks/useTron';
import { useContractService } from '../hooks/useContractService';
import { useProjects } from '../hooks/useProjects';
import { BrowserProvider } from 'ethers';
import TronWeb from 'tronweb';
import { Project, IBlockchainContractService } from '../types';

/**
 * Interface describing the context data available to consuming components
 */
export interface BlockchainContextProps {
  provider: BrowserProvider | null;
  tronWeb: TronWeb | null;
  contractService: IBlockchainContractService | null;
  connectEthereum: () => void;
  connectTron: () => void;
  projects: Project[];
  isLoadingProjects: boolean;
  errorProjects: Error | null;
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
 * - Managing project-related data and state
 *
 * @param {React.ReactNode} children - Child components that need access to blockchain context.
 * @returns JSX Element that provides the BlockchainContext.
 */
export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Custom hooks to manage connection to Ethereum and Tron wallets
  const { provider, connectEthereum } = useEthereum();
  const { tronWeb, connectTron } = useTron();

  // Determine the blockchain type based on the connected provider
  const blockchainType: 'ethereum' | 'tron' | null = provider ? 'ethereum' : tronWeb ? 'tron' : null;

  // Call useContractService unconditionally, but handle the return value inside useMemo
  const contractService = useContractService(provider, tronWeb, blockchainType === 'ethereum' ? 'ethereum' : 'tron');

  // Fetch projects using the contract service and handle project-related state
  const { data: projects = [], isLoading: isLoadingProjects, error: errorProjects } = useProjects(contractService);

  /**
   * Memoize the context value to prevent unnecessary re-renders.
   * The value will only be recalculated when its dependencies change.
   */
  const contextValue = useMemo(
    () => ({
      provider,
      tronWeb,
      contractService,
      connectEthereum,
      connectTron,
      projects,
      isLoadingProjects,
      errorProjects,
    }),
    [provider, tronWeb, contractService, connectEthereum, connectTron, projects, isLoadingProjects, errorProjects]
  );

  /**
   * Return the provider with the memoized context value.
   * This allows child components to consume the context efficiently.
   */
  return <BlockchainContext.Provider value={contextValue}>{children}</BlockchainContext.Provider>;
};
