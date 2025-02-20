import { ethers } from 'ethers';
import SafeABI from '../abi/Safe.json';
import { IBlockchainContractService, Project, SafeContract } from '../types';
import config from '../config';
import { BrowserProvider } from 'ethers';
import { Token } from '../config/tokens';
import { calculateMilestoneAmountsWei } from './helpers/calculateMilestoneAmountsWei';
import { prepareErc20Funding } from './helpers/prepareErc20Funding';

/**
 * @class EthereumContractService
 * @description A service class to interact with the Safe smart contract on Ethereum.
 */
export class EthereumContractService implements IBlockchainContractService {
  private readOnlyContract: SafeContract;
  private contract: SafeContract;
  private provider: ethers.Provider;

  /**
   * @constructor
   * @param {ethers.Provider} provider - The Ethers.js provider instance (can be MetaMask or public RPC).
   */
  constructor(provider?: ethers.Provider) {
    const publicProvider = new ethers.JsonRpcProvider(config.env.RPC_URL);
    // Create read-only and writable contract instances
    this.readOnlyContract = new ethers.Contract(config.env.CONTRACT_ADDRESS, SafeABI, publicProvider) as SafeContract;

    // Use the provided provider or the public one
    this.contract = new ethers.Contract(
      config.env.CONTRACT_ADDRESS,
      SafeABI,
      provider || publicProvider
    ) as SafeContract;

    this.provider = provider || publicProvider;
  }

  /**
   * @method getProjectCount
   * @description Retrieves the total number of projects from the smart contract.
   * @returns {Promise<number>} The total number of projects.
   * @throws Will throw an error if the contract call fails.
   */
  async getProjectCount(): Promise<number> {
    try {
      const count = await this.readOnlyContract.projectCount();
      return Number(count);
    } catch (error) {
      console.error('Error fetching project count:', error);
      throw new Error('Failed to fetch project count');
    }
  }

  /**
   * @method getProjectById
   * @description Retrieves a project by its ID along with its milestone amounts.
   * @param {number} id - The ID of the project.
   * @returns {Promise<Project>} The project details.
   * @throws Will throw an error if the contract call fails.
   */
  async getProjectById(id: number): Promise<Project> {
    try {
      const projectData = await this.readOnlyContract.projects(id);
      // Fetch milestone amounts separately
      const milestoneAmounts = await this.readOnlyContract.getMilestoneAmounts(id);
      return this.formatProjectData(projectData, milestoneAmounts);
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw new Error(`Failed to fetch project with ID ${id}`);
    }
  }

  /**
   * @method getProjects
   * @description Retrieves a list of projects with pagination.
   * @param {number} offset - The starting index for pagination.
   * @param {number} limit - The number of projects to fetch.
   * @returns {Promise<Project[]>} An array of projects.
   * @throws Will throw an error if the contract call fails.
   */
  async getProjects(offset = 0, limit = 10): Promise<Project[]> {
    try {
      const projectCount = await this.getProjectCount();
      const projects: Project[] = [];

      const end = Math.min(offset + limit, projectCount);

      for (let i = offset; i < end; i++) {
        const projectData = await this.getProjectById(i);
        projects.push(projectData);
      }

      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  /**
   * @method connectWithSigner
   * @description Connects the contract with a signer (used for transactions).
   * @param {ethers.Signer} signer - The signer from MetaMask.
   */
  connectWithSigner(signer: ethers.Signer) {
    this.contract = this.contract.connect(signer) as SafeContract;
  }

  /**
   * @method createProject
   * @description Creates a new project on-chain.
   * Includes optional logic for infinite allowance if using ERC-20 tokens.
   *
   * @param {string} executor - Address of the executor.
   * @param {string} totalAmount - Total project amount in human-readable token units (e.g., "1.5").
   * @param {number[]} milestonePercents - Milestone percentages that sum to 100.
   * @param {number} platformFeePercent - Platform fee as a percentage (1 => 1%).
   * @param {Token} token - Token object (if address == zeroAddress, assume native currency).
   * @param {boolean} [useInfiniteAllowance=true] - Whether to set a large one-time allowance for ERC-20.
   * @returns {Promise<ethers.ContractTransaction>} The transaction object.
   *
   * @example
   * const tx = await ethereumContractService.createProject(
   *   '0xExecutorAddr...',
   *   '10',         // 10 tokens total
   *   [40, 60],     // two milestones: 40% and 60%
   *   2,            // 2% platform fee
   *   { name: 'USDT', address: '0x...' },
   *   true          // infinite allowance
   * );
   */
  async createProject(
    executor: string,
    totalAmount: string,
    milestonePercents: number[],
    platformFeePercent: number,
    token: Token,
    useInfiniteAllowance = true
  ): Promise<ethers.ContractTransaction> {
    try {
      // Validate the executor address
      this.validateExecutorAddress(executor);

      // Get the signer from the provider
      const walletProvider = this.provider as BrowserProvider;
      const signer = await walletProvider.getSigner();
      this.connectWithSigner(signer);

      // Determine if we're dealing with native currency or an ERC-20 token
      const isNativeCurrency = token.address === config.networks.zeroAddress;

      // Parse totalAmount into Wei (bigint) and handle allowance if needed
      const totalAmountWei = isNativeCurrency
        ? ethers.parseEther(totalAmount)
        : await prepareErc20Funding(signer, token, totalAmount, useInfiniteAllowance);

      // Convert the platform fee to basis points
      const platformFeeInBasisPoints = this.convertPercentToBasisPoints(platformFeePercent);

      // Calculate milestone amounts in Wei, subtracting the fee from the total
      const milestoneAmountsWei = calculateMilestoneAmountsWei(
        totalAmountWei,
        platformFeeInBasisPoints,
        milestonePercents
      );

      // If using native currency, pass { value: totalAmountWei } to fund the transaction
      const txOptions = isNativeCurrency ? { value: totalAmountWei } : {};

      // Call createProject in the contract
      const tx = await this.contract.createProject(
        executor,
        totalAmountWei,
        milestoneAmountsWei,
        platformFeeInBasisPoints,
        isNativeCurrency ? config.networks.zeroAddress : token.address,
        txOptions
      );

      return tx;
    } catch (error) {
      console.error('Error in createProject:', error);
      throw new Error('unexpected_error');
    }
  }

  /**
   * @method formatProjectData
   * @description Formats raw project data from the smart contract.
   * @param {Project} project - The raw project data from the contract.
   * @param {bigint[]} milestoneAmounts - The milestone amounts in wei.
   * @returns {Project} The formatted project data.
   * @throws Will throw an error if required project data is missing.
   */
  private formatProjectData(project: Project, milestoneAmounts: bigint[]): Project {
    return {
      client: project.client,
      executor: project.executor,
      totalAmount: BigInt(project.totalAmount),
      milestoneAmounts: milestoneAmounts.map((m: bigint) => ethers.formatEther(m)),
      currentMilestone: BigInt(project.currentMilestone),
      isCompleted: project.isCompleted,
      isCancelled: project.isCancelled,
      isFunded: project.isFunded,
      token: project.token,
    };
  }

  /**
   * @method validateExecutorAddress
   * @description Ensures the executor address is valid and not the zero address.
   * @param {string} executor - The executor address.
   * @throws Will throw if the address is invalid or zero.
   */
  private validateExecutorAddress(executor: string): void {
    if (!ethers.isAddress(executor) || executor === config.networks.zeroAddress) {
      throw new Error('invalid_executor_address');
    }
  }

  /**
   * @method convertPercentToBasisPoints
   * @description Converts a percentage to basis points (1% => 100).
   * @param {number} percent - Platform fee percent.
   * @returns {number} The fee in basis points.
   */
  private convertPercentToBasisPoints(percent: number): number {
    return percent * 100;
  }
}
