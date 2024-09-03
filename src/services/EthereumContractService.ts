import { BrowserProvider, ethers } from 'ethers';
import SafeABI from '../abi/Safe.json';
import { IBlockchainContractService, Project, SafeContract } from '../types';
import config from '../config';

/**
 * @class EthereumContractService
 * @description A service class to interact with the Safe smart contract on Ethereum.
 */
export class EthereumContractService implements IBlockchainContractService {
  private contract: SafeContract;

  /**
   * @constructor
   * @param {BrowserProvider} provider - The Ethers.js provider instance.
   */
  constructor(provider: BrowserProvider) {
    this.contract = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      SafeABI,
      provider
    ) as SafeContract;
  }

  /**
   * @method getProjectCount
   * @description Retrieves the total number of projects from the smart contract.
   * @returns {Promise<number>} The total number of projects.
   * @throws Will throw an error if the contract call fails.
   */
  async getProjectCount(): Promise<number> {
    try {
      const count = await this.contract.projectCount();
      return Number(count);
    } catch (error) {
      console.error('Error fetching project count:', error);
      throw new Error('Failed to fetch project count');
    }
  }

  /**
   * @method getProjectById
   * @description Retrieves a project by its ID.
   * @param {number} id - The ID of the project.
   * @returns {Promise<Project>} The project details.
   * @throws Will throw an error if the contract call fails.
   */
  async getProjectById(id: number): Promise<Project> {
    try {
      const project = await this.contract.projects(id);
      return this.formatProjectData(project);
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
   * @method createProject
   * @description Creates a new project on the blockchain.
   * @param {string} executor - The address of the executor (freelancer).
   * @param {string} totalAmount - The total amount for the project in Ether.
   * @param {string[]} milestoneAmounts - An array of milestone amounts in Ether.
   * @param {number} platformFeePercent - The platform fee percentage.
   * @param {string} tokenAddress - The address of the ERC20 token used for payments.
   * @param {ethers.Signer} signer - The signer to authorize the transaction.
   * @returns {Promise<ethers.ContractTransaction>} The transaction object.
   * @throws Will throw an error if the contract call fails.
   */
  async createProject(
    executor: string,
    totalAmount: string,
    milestoneAmounts: string[],
    platformFeePercent: number,
    tokenAddress: string,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransaction> {
    try {
      const contractWithSigner = this.contract.connect(signer) as SafeContract;
      const totalAmountInWei = ethers.parseEther(totalAmount);
      const milestoneAmountsInWei = milestoneAmounts.map((amount) =>
        ethers.parseEther(amount)
      );

      return await contractWithSigner.createProject(
        executor,
        totalAmountInWei,
        milestoneAmountsInWei,
        platformFeePercent,
        tokenAddress
      );
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  /**
   * @method formatProjectData
   * @description Formats raw project data from the smart contract.
   * @param {Project} project - The raw project data from the contract.
   * @returns {Project} The formatted project data.
   * @throws Will throw an error if required project data is missing.
   */
  private formatProjectData(project: Project): Project {
    if (!project.milestoneAmounts) {
      throw new Error('Milestone amounts are missing');
    }

    return {
      client: project.client,
      executor: project.executor,
      totalAmount: BigInt(project.totalAmount),
      milestoneAmounts:
        project.milestoneAmounts ??
        [].map((m: number) => ethers.formatEther(BigInt(m))),
      currentMilestone: BigInt(project.currentMilestone),
      isCompleted: project.isCompleted,
      isCancelled: project.isCancelled,
      isFunded: project.isFunded,
      token: project.token,
    };
  }
}
