import { BigNumberish, Contract, ContractTransaction, ethers } from 'ethers';

// Define the structure of the Project as returned by the `projects` function
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

export interface ContractContext {
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  connectWallet: () => void;
  projects: Project[];
}

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
