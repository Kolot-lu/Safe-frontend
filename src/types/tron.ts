import { BigNumberish } from 'ethers';
import Contract from 'tronweb';
import { Project } from '.';

/**
 * Defines the structure of a Tron contract transaction.
 */
export interface TronContractTransaction {
  id: string;
  blockNumber: number;
  blockTimeStamp: number;
  contractAddress: string;
  receipt: {
    netFee: number;
    energyUsage: number;
    energyFee: number;
    result: string;
  };
}

/**
 * Interface for callable methods in Tron smart contracts.
 */
export interface CallableContractMethod<T> {
  call: () => Promise<T>;
}

/**
 * Interface for sendable methods in Tron smart contracts.
 */
export interface SendableContractMethod<T> {
  send: (options: { from: string }) => Promise<T>;
}

/**
 * Tron-specific contract interface that defines the methods available in the contract.
 */
export interface TronSafeContract extends Contract {
  createProject: (
    _executor: string,
    _totalAmount: BigNumberish,
    _milestoneAmounts: BigNumberish[],
    _platformFeePercent: BigNumberish,
    _token: string
  ) => SendableContractMethod<TronContractTransaction>;

  cancelProject: (
    _projectId: BigNumberish
  ) => SendableContractMethod<TronContractTransaction>;
  confirmMilestone: (
    _projectId: BigNumberish
  ) => SendableContractMethod<TronContractTransaction>;
  executorInitiateProject: (
    _client: string,
    _totalAmount: BigNumberish,
    _milestoneAmounts: BigNumberish[],
    _platformFeePercent: BigNumberish,
    _token: string
  ) => SendableContractMethod<TronContractTransaction>;

  fundProject: (
    _projectId: BigNumberish
  ) => SendableContractMethod<TronContractTransaction>;
  owner: () => CallableContractMethod<string>;
  platformFunds: (token: string) => CallableContractMethod<bigint>;
  projectCount: () => CallableContractMethod<bigint>;
  projects: (_projectId: BigNumberish) => CallableContractMethod<Project>;
  getMilestoneAmounts: (
    projectId: BigNumberish
  ) => CallableContractMethod<bigint[]>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
