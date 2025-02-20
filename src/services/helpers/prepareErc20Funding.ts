import { ethers } from "ethers";
import { Token } from "../../config/tokens";
import ERC20ABI from '../../abi/ERC20.json';
import config from "../../config";
import { approveERC20Allowance } from "./approveERC20Allowance";

/**
   * @function prepareErc20Funding
   * @description Fetches token decimals, parses `totalAmount` to Wei, and handles ERC-20 allowance logic.
   * @param {ethers.Signer} signer - The signer from the wallet.
   * @param {Token} token - The ERC-20 token object.
   * @param {string} totalAmount - Amount in human-readable form (e.g. "10.5").
   * @param {boolean} useInfiniteAllowance - If true, approves MaxUint256 once; otherwise approves the exact amount.
   * @returns {Promise<bigint>} The total amount in Wei (bigint).
   */
export const prepareErc20Funding = async (
    signer: ethers.Signer,
    token: Token,
    totalAmount: string,
    useInfiniteAllowance: boolean
  ): Promise<bigint> => {
    const tokenContract = new ethers.Contract(token.address, ERC20ABI, signer);
    const decimals = await tokenContract.decimals();

    // Parse amount using token decimals
    const totalAmountWei = ethers.parseUnits(totalAmount, decimals);

    // If amount is zero, no need to approve
    if (totalAmountWei > 0n) {
      const currentAllowance = await tokenContract.allowance(
        await signer.getAddress(),
        config.env.CONTRACT_ADDRESS
      );

      // Decide whether to grant infinite or exact allowance
      if (currentAllowance < totalAmountWei) {
        // Reset allowance to 0 if there's any existing allowance
        if (currentAllowance > 0n) {
          const txReset = await tokenContract.approve(config.env.CONTRACT_ADDRESS, 0);
          await txReset.wait();
        }

        if (useInfiniteAllowance) {
          await approveERC20Allowance(ethers.MaxUint256, token.address, signer);
        } else {
          await approveERC20Allowance(totalAmountWei, token.address, signer);
        }
      }
    }

    return totalAmountWei;
  }