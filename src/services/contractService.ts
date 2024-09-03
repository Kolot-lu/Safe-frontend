import { BrowserProvider, ethers } from 'ethers';
import SafeABI from '../abi/Safe.json';
import config from '../config';
import { Project, SafeContract } from '../types';

/**
 * @class ContractService
 * @description A service class to interact with the Safe smart contract.
 */
class ContractService {
  private provider: BrowserProvider;
  private contract: SafeContract;

  /**
   * @constructor
   * @param {BrowserProvider} provider - The Ethers.js provider instance.
   */
  constructor(provider: BrowserProvider) {
    this.provider = provider;
    this.contract = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      SafeABI,
      provider
    ) as SafeContract;
  }

  /**
   * @async
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
      console.error('Failed to fetch project count:', error);
      throw error;
    }
  }

  /**
   * @async
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
      console.error(`Failed to fetch project with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * @async
   * @method getProjects
   * @description Retrieves a list of projects with pagination.
   * @param {number} offset - The starting index for pagination.
   * @param {number} limit - The maximum number of projects to return.
   * @returns {Promise<Project[]>} An array of projects.
   * @throws Will throw an error if the contract call fails.
   */
  async getProjects(offset = 0, limit = 10): Promise<Project[]> {
    try {
      const projectCount = await this.getProjectCount();
      const projects: Project[] = [];
      const end = Math.min(offset + limit, projectCount);

      for (let i = offset; i < end; i++) {
        const projectData = await this.contract.projects(i);
        projects.push(this.formatProjectData(projectData));
      }

      return projects;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  /**
   * @private
   * @method formatProjectData
   * @description Formats raw project data from the smart contract.
   * @param {any} project - The raw project data from the contract.
   * @returns {Project} The formatted project data.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatProjectData(project: any): Project {
    return {
      client: project.client,
      executor: project.executor,
      totalAmount: BigInt(project.totalAmount),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      milestoneAmounts: project.milestoneAmounts.map((m: any) =>
        ethers.formatEther(BigInt(m))
      ),
      currentMilestone: BigInt(project.currentMilestone),
      isCompleted: project.isCompleted,
      isCancelled: project.isCancelled,
      isFunded: project.isFunded,
      token: project.token,
    };
  }

  /**
   * @async
   * @method createProject
   * @description Creates a new project on the smart contract.
   * @param {string} executor - The address of the executor (freelancer).
   * @param {string} totalAmount - The total amount for the project in Ether.
   * @param {string[]} milestoneAmounts - An array of milestone amounts in Ether.
   * @param {number} platformFeePercent - The platform fee percentage.
   * @param {string} tokenAddress - The address of the ERC20/TRC20 token used for payments.
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

      const tx = await contractWithSigner.createProject(
        executor,
        totalAmountInWei,
        milestoneAmountsInWei,
        platformFeePercent,
        tokenAddress
      );

      return tx;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  }
}

export default ContractService;
