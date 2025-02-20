  /**
   * @function calculateMilestoneAmountsWei
   * @description Splits `totalAmountWei` into milestone portions.
   * Also subtracts the platform fee (in basis points) from the total before distribution.
   *
   * @param {bigint} totalAmountWei - Total amount in Wei.
   * @param {number} platformFeeBP - Platform fee in basis points (1% => 100).
   * @param {number[]} milestonePercents - Array of milestone percentages that sum up to 100.
   * @returns {bigint[]} Array of milestone amounts in Wei (after subtracting the fee).
   */
export const calculateMilestoneAmountsWei = (
    totalAmountWei: bigint,
    platformFeeBP: number,
    milestonePercents: number[]
  ): bigint[] => {
    const sumPercents = milestonePercents.reduce((acc, pct) => acc + pct, 0);
    if (sumPercents !== 100) {
      console.error(`The sum of milestonePercents must be exactly 100, but got ${sumPercents}.`);
      throw new Error('milestones_not_100');
    }

    const fee = (totalAmountWei * BigInt(platformFeeBP)) / 10_000n;
    if (fee > totalAmountWei) {
      console.error(`Calculated fee (${fee}) exceeds the total amount (${totalAmountWei}).`);
      throw new Error('exceed_total_amount');
    }

    const remain = totalAmountWei - fee;
    return milestonePercents.map((pct) => {
      return (remain * BigInt(Math.floor(pct))) / 100n;
    });
  };