import { Contract } from "ethers";
import { Project } from "../types";
import SafeABI from "../abi/Safe.json";

import { ethers } from "ethers";

export const getEthereumProjects = async (contractAddress: string, provider: ethers.BrowserProvider): Promise<Project[]> => {
  const contract = new Contract(contractAddress, SafeABI, provider);
  const projectCount = await contract.projectCount();
  const projects: Project[] = [];

  for (let i = 0; i < projectCount; i++) {
    const project = await contract.projects(i);
    projects.push({
      client: project.client,
      executor: project.executor,
      totalAmount: project.totalAmount.toString(),
      milestoneAmounts: project.milestoneAmounts.map((m: any) => m.toString()),
      currentMilestone: project.currentMilestone,
      isCompleted: project.isCompleted,
      isCancelled: project.isCancelled,
      isFunded: project.isFunded,
      token: project.token,
    });
  }

  return projects;
};
