import { BigNumberish, ethers } from "ethers";

export interface Project {
  client: string;
  executor: string;
  totalAmount: BigNumberish;
  milestoneAmounts: BigNumberish[];
  currentMilestone: number;
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
