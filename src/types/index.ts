import { BigNumberish, Contract, ContractTransaction, ethers } from 'ethers';
import { TronContractTransaction } from './tron';
import TronWeb from 'tronweb';

// Define the structure of a project, as returned by both Tron and Ethereum contracts
export interface Project {
  client: string;
  executor: string;
  totalAmount: bigint;
  currentMilestone: bigint;
  milestoneAmounts?: bigint[];
  isCompleted: boolean;
  isCancelled: boolean;
  isFunded: boolean;
  token: string;
}

/**
 * Defines the context used by blockchain interactions.
 */
export interface ContractContext {
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connectWallet: () => void;
  projects: Project[];
}

/**
 * Ethereum-specific contract interface, extending the base Contract from ethers.js.
 */
export interface SafeContract extends Contract {
  createProject: (
    _executor: string,
    _totalAmount: BigNumberish,
    _milestoneAmounts: BigNumberish[],
    _platformFeePercent: BigNumberish,
    _token: string
  ) => Promise<ContractTransaction>;

  cancelProject: (_projectId: BigNumberish) => Promise<ContractTransaction>;
  confirmMilestone: (_projectId: BigNumberish) => Promise<ContractTransaction>;
  executorInitiateProject: (
    _client: string,
    _totalAmount: BigNumberish,
    _milestoneAmounts: BigNumberish[],
    _platformFeePercent: BigNumberish,
    _token: string
  ) => Promise<ContractTransaction>;

  fundProject: (_projectId: BigNumberish) => Promise<ContractTransaction>;
  owner: () => Promise<string>;
  platformFunds: (token: string) => Promise<bigint>;
  projectCount: () => Promise<bigint>;
  projects: (_projectId: BigNumberish) => Promise<Project>;
  getMilestoneAmounts: (projectId: BigNumberish) => Promise<bigint[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Event interfaces for Ethereum contract events.
 */
export interface MilestoneCompletedEvent {
  projectId: bigint;
  milestoneIndex: bigint;
}

export interface PlatformWithdrawalEvent {
  token: string;
  amount: bigint;
}

export interface ProjectCancelledEvent {
  projectId: bigint;
}

export interface ProjectCreatedEvent {
  projectId: bigint;
  client: string;
  executor: string;
  token: string;
}

/**
 * Interface for a blockchain contract service (Ethereum or Tron).
 */
export interface IBlockchainContractService {
  getProjectCount(): Promise<number>;
  getProjectById(id: number): Promise<Project>;
  getProjects(offset: number, limit: number): Promise<Project[]>;
  createProject(
    executor: string,
    totalAmount: string,
    milestoneAmounts: string[],
    platformFeePercent: number,
    tokenAddress: string,
    signer: ethers.Signer | TronWeb
  ): Promise<ContractTransaction | TronContractTransaction>;
}
