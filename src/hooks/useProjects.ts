import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IBlockchainContractService, Project } from '../types';

/**
 * Hook to fetch and manage projects from the blockchain using the contract service.
 *
 * @param {IBlockchainContractService | null} contractService - The contract service initialized via useContractService.
 * @param {number} [offset=0] - The starting point for pagination of projects.
 * @param {number} [limit=10] - The maximum number of projects to fetch.
 * @returns {UseQueryResult<Project[]>} Query result containing the list of projects, loading state, and errors if any.
 */
export const useProjects = (
  contractService: IBlockchainContractService | null,
  offset = 0,
  limit = 10
): UseQueryResult<Project[]> => {
  const fetchProjects = async (): Promise<Project[]> => {
    if (!contractService)
      throw new Error('Contract service is not initialized');
    return contractService.getProjects(offset, limit);
  };

  return useQuery<Project[], Error, Project[]>({
    queryKey: ['projects', offset, limit],
    queryFn: fetchProjects,
    enabled: !!contractService,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
