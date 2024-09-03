import TronWeb from 'tronweb';
import SafeABI from '../abi/Safe.json';
import { IBlockchainContractService, Project } from '../types';
import config from '../config';
import { TronContractTransaction, TronSafeContract } from '../types/tron';

export class TronContractService implements IBlockchainContractService {
  private contract: TronSafeContract;

  constructor(tronWeb: TronWeb) {
    this.contract = tronWeb.contract(SafeABI, config.CONTRACT_ADDRESS);
  }

  /**
   * @async
   * @method getProjectCount
   * @description Retrieves the total number of projects from the smart contract.
   * @returns {Promise<number>} The total number of projects.
   */
  async getProjectCount(): Promise<number> {
    const count = await this.contract.projectCount().call();
    return Number(count);
  }

  /**
   * @async
   * @method getProjectById
   * @description Retrieves a project by its ID.
   * @param {number} id - The ID of the project.
   * @returns {Promise<Project>} The project details.
   */
  async getProjectById(id: number): Promise<Project> {
    const project = await this.contract.projects(id).call();
    return this.formatProjectData(project);
  }

  /**
   * @async
   * @method getProjects
   * @description Retrieves a list of projects with pagination.
   * @param {number} offset - The starting index for pagination.
   * @param {number} limit - The maximum number of projects to return.
   * @returns {Promise<Project[]>} An array of projects.
   */
  async getProjects(offset = 0, limit = 10): Promise<Project[]> {
    const projectCount = await this.getProjectCount();
    const projects: Project[] = [];
    const end = Math.min(offset + limit, projectCount);

    for (let i = offset; i < end; i++) {
      const projectData = await this.getProjectById(i);
      projects.push(projectData);
    }

    return projects;
  }

  /**
   * @async
   * @method createProject
   * @description Creates a new project on the Tron blockchain.
   * @param {string} executor - The address of the executor (freelancer).
   * @param {string} totalAmount - The total amount for the project in TRX.
   * @param {string[]} milestoneAmounts - An array of milestone amounts in TRX.
   * @param {number} platformFeePercent - The platform fee percentage.
   * @param {string} tokenAddress - The address of the TRC20 token used for payments.
   * @param {TronWeb} tronWeb - The TronWeb instance with the signer.
   * @returns {Promise<TronContractTransaction>} The transaction object.
   */
  async createProject(
    executor: string,
    totalAmount: string,
    milestoneAmounts: string[],
    platformFeePercent: number,
    tokenAddress: string,
    tronWeb: TronWeb
  ): Promise<TronContractTransaction> {
    if(!tronWeb.defaultAddress) throw new Error('TronWeb address not found');

    return await this.contract
      .createProject(
        executor,
        totalAmount,
        milestoneAmounts,
        platformFeePercent,
        tokenAddress
      )
      .send({ from: tronWeb.defaultAddress.base58 }) as TronContractTransaction;
  }

  /**
   * @private
   * @method formatProjectData
   * @description Formats raw project data from the Tron blockchain.
   * @param {Project} project - The raw project data from the contract.
   * @returns {Project} The formatted project data.
   */
  private formatProjectData(project: Project): Project {
    if (!project.milestoneAmounts)
        throw new Error('Milestone amounts are missing');

    return {
      client: project.client,
      executor: project.executor,
      totalAmount: BigInt(project.totalAmount),
      milestoneAmounts: project.milestoneAmounts 
      ? project.milestoneAmounts.map((m: bigint) => TronWeb.toBigNumber(m).toString())
      : [],
      currentMilestone: BigInt(project.currentMilestone),
      isCompleted: project.isCompleted,
      isCancelled: project.isCancelled,
      isFunded: project.isFunded,
      token: project.token,
    };
  }
}
