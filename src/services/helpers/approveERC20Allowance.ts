import { ethers } from 'ethers';
import config from '../../config';
import ERC20ABI from '../../abi/ERC20.json';

/**
 * @function approveERC20Allowance
 * @description Approves the Safe contract to spend a certain amount of an ERC-20 token on behalf of the user.
 *
 * @param {bigint} amount - Amount of tokens (in Wei) to approve.
 * @param {string} tokenAddress - The ERC-20 token contract address.
 * @param {ethers.Signer} signer - The signer (must hold tokens).
 * @returns {Promise<ethers.ContractTransaction>} The approve transaction object.
 */
export const approveERC20Allowance = async (
  amount: bigint,
  tokenAddress: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransaction> => {
  if (tokenAddress === config.networks.zeroAddress) {
    throw new Error('Cannot approve allowance for native currency.');
  }
  const tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, signer);
  const tx = await tokenContract.approve(config.env.CONTRACT_ADDRESS, amount);
  return tx.wait();
};
