import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/Layout/Page/PageLayout';
import Button from '../components/ui/Button';
import { useBlockchain } from '../hooks/useBlockchain';
import Input from '../components/ui/Inbut';
import config from '../config';

const translations = 'pages.create_project';
const ZERO_ADDRESS = config.ZERRO_ADDRESS;
const MOCK_ETH_PRICE_USD = 3663; // Mock ETH price in USD for demonstration

type Unit = 'ETH' | 'Gwei' | 'Wei';

/**
 * Converts ETH to Gwei.
 */
function ethToGwei(eth: number): number {
  return eth * 1_000_000_000;
}

/**
 * Converts ETH to Wei.
 */
function ethToWei(eth: number): number {
  return eth * 1_000_000_000_000_000_000;
}

/**
 * Converts a value in a given unit back to ETH.
 */
function fromUnit(value: number, unit: Unit): number {
  if (unit === 'Wei') return value / 1_000_000_000_000_000_000;
  if (unit === 'Gwei') return value / 1_000_000_000;
  return value; // ETH by default
}

/**
 * Converts a value in ETH to a specified unit.
 */
function toUnit(eth: number, unit: Unit): number {
  if (unit === 'Wei') return ethToWei(eth);
  if (unit === 'Gwei') return ethToGwei(eth);
  return eth; // ETH by default
}

/**
 * Formats a number with a fixed number of decimal places.
 */
function formatNumber(num: number, decimals = 8): string {
  return num.toFixed(decimals);
}

/**
 * Returns a string showing ETH, Gwei, Wei conversions for a given ETH value.
 */
function showConversions(ethValue: number): string {
  const gweiValue = ethToGwei(ethValue);
  const weiValue = ethToWei(ethValue);
  return `ETH: ${formatNumber(ethValue)} | Gwei: ${gweiValue.toFixed(2)} | Wei: ${weiValue.toFixed(0)}`;
}

/**
 * Returns a string showing the approximate USD value of a given ETH amount.
 */
function showUSDConversion(ethValue: number): string {
  const usdValue = ethValue * MOCK_ETH_PRICE_USD;
  return `~$${usdValue.toFixed(4)} USD (mock)`;
}

const CreateProjectPage: React.FC = () => {
  const { contractService, signer } = useBlockchain();
  const { t } = useTranslation();

  // State for user inputs
  const [executor, setExecutor] = useState('');
  const [displayUnit, setDisplayUnit] = useState<Unit>('ETH'); // current unit for display
  const [rawTotalAmount, setRawTotalAmount] = useState(''); // user input in the selected display unit
  const [milestonePercentages, setMilestonePercentages] = useState<string[]>(['']);
  const [platformFeePercent, setPlatformFeePercent] = useState('');
  const [tokenAddress, setTokenAddress] = useState(ZERO_ADDRESS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Convert the raw input from the selected display unit to ETH internally
  const totalAmountNum = useMemo(() => {
    const val = parseFloat(rawTotalAmount);
    if (isNaN(val) || val < 0) return 0;
    return fromUnit(val, displayUnit);
  }, [rawTotalAmount, displayUnit]);

  const userFeePercent = parseFloat(platformFeePercent) || 0;
  const feeForContract = Math.round(userFeePercent * 100);

  // Calculate fee and net amount in ETH
  const feeAmount = useMemo(() => {
    if (totalAmountNum > 0 && userFeePercent > 0) {
      return totalAmountNum * (userFeePercent / 100);
    }
    return 0;
  }, [totalAmountNum, userFeePercent]);

  const netAmount = totalAmountNum - feeAmount;

  // Parse milestone percentages and calculate amounts in ETH
  const milestonePercentsArray = milestonePercentages.map((p) => parseFloat(p) || 0);
  const totalMilestonesPercent = milestonePercentsArray.reduce((acc, val) => acc + val, 0);
  const milestoneAmountsInEth = milestonePercentsArray.map((percent) => netAmount * (percent / 100));

  /**
   * Handles form submission, validates input, and calls the contract's createProject method.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (
        !executor ||
        !rawTotalAmount ||
        !platformFeePercent ||
        !tokenAddress ||
        milestonePercentages.some((p) => !p)
      ) {
        throw new Error(t(`${translations}.errors.invalid_input`));
      }

      if (feeForContract < 100) {
        // feeForContract < 100 means less than 1%
        throw new Error(t(`${translations}.errors.fee_too_low`));
      }

      if (!contractService) {
        throw new Error(t(`${translations}.errors.no_contract_service`));
      }

      if (!signer) {
        throw new Error(t(`${translations}.errors.no_signer`));
      }

      // Check milestone sum approximation
      const sumMilestonesETH = milestoneAmountsInEth.reduce((acc, val) => acc + val, 0);
      const epsilon = 1e-12;
      if (Math.abs(sumMilestonesETH - netAmount) > epsilon) {
        console.warn('Sum of milestones does not match netAmount exactly.');
      }

      // Prepare milestone amounts as strings for the contract
      // We'll let the contract service handle parseEther, ensuring we round to 18 decimals
      const milestoneAmountsStr = milestoneAmountsInEth.map((val) => val.toString());

      await contractService.createProject(
        executor,
        totalAmountNum.toString(),
        milestoneAmountsStr,
        feeForContract,
        tokenAddress,
        signer
      );

      alert(t(`${translations}.success`));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || t(`${translations}.errors.generic`));
      } else {
        setErrorMessage(t(`${translations}.errors.generic`));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Updates the milestone percentages when a user modifies a particular field.
   */
  const handleMilestoneChange = (index: number, value: string) => {
    const updated = [...milestonePercentages];
    updated[index] = value;
    setMilestonePercentages(updated);
  };

  const addMilestone = () => setMilestonePercentages([...milestonePercentages, '']);
  const removeMilestone = (index: number) => {
    const updated = milestonePercentages.filter((_, i) => i !== index);
    setMilestonePercentages(updated);
  };

  /**
   * Switches the display unit for the total amount.
   * Converts the current ETH value into the new unit and updates rawTotalAmount accordingly.
   */
  const handleUnitSwitch = (newUnit: Unit) => {
    // Convert current ETH value to new unit
    const ethVal = totalAmountNum;
    const converted = toUnit(ethVal, newUnit);
    setDisplayUnit(newUnit);
    setRawTotalAmount(converted === 0 ? '' : converted.toString());
  };

  /**
   * Handles changes in the total amount input, converting from the entered unit to ETH internally.
   */
  const handleTotalAmountChange = (val: string) => {
    setRawTotalAmount(val);
  };

  return (
    <PageLayout.FixedWidth>
      <h1>{t(`${translations}.title`)}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t(`${translations}.fields.executor`)}
          placeholder="0x123..."
          value={executor}
          onChange={(e) => setExecutor(e.target.value)}
          required
        />

        {/* Total Amount Section with Unit Toggle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <Input
              label={`${t(`${translations}.fields.total_amount`)} (${displayUnit})`}
              placeholder={`0.0 ${displayUnit}`}
              value={rawTotalAmount}
              onChange={(e) => handleTotalAmountChange(e.target.value)}
              type="number"
              step="any"
              required
            />
            <div className="flex gap-2 mt-7">
              <Button
                type="button"
                variant={displayUnit === 'ETH' ? 'primary' : 'ghost'}
                size="xsmall"
                onClick={() => handleUnitSwitch('ETH')}
              >
                ETH
              </Button>
              <Button
                type="button"
                variant={displayUnit === 'Gwei' ? 'primary' : 'ghost'}
                size="xsmall"
                onClick={() => handleUnitSwitch('Gwei')}
              >
                Gwei
              </Button>
              <Button
                type="button"
                variant={displayUnit === 'Wei' ? 'primary' : 'ghost'}
                size="xsmall"
                onClick={() => handleUnitSwitch('Wei')}
              >
                Wei
              </Button>
            </div>
          </div>

          {totalAmountNum > 0 && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                {t(`${translations}.fields.conversions`)}: {showConversions(totalAmountNum)}
              </p>
              <p>{showUSDConversion(totalAmountNum)}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Input
            label={t(`${translations}.fields.platform_fee`)}
            placeholder="Example: 5 for 5%"
            value={platformFeePercent}
            onChange={(e) => setPlatformFeePercent(e.target.value)}
            type="number"
            step="any"
            required
          />
          {userFeePercent > 0 && (
            <p className="text-sm text-gray-500">
              {t(`${translations}.fields.fee_explanation`, { fee: userFeePercent })}
            </p>
          )}
        </div>

        {totalAmountNum > 0 && userFeePercent > 0 && (
          <div className="space-y-2 text-sm text-gray-500">
            <p>
              {t(`${translations}.fields.calculated_fee`)}: {formatNumber(feeAmount)} ETH ({showConversions(feeAmount)})
              <br />
              {showUSDConversion(feeAmount)}
            </p>
            <p>
              {t(`${translations}.fields.net_amount`)}: {formatNumber(netAmount)} ETH ({showConversions(netAmount)})
              <br />
              {showUSDConversion(netAmount)}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="block font-medium mb-2">{t(`${translations}.fields.milestones`)}</label>
          {milestonePercentages.map((percent, index) => {
            const percNum = parseFloat(percent) || 0;
            const milestoneEth = milestoneAmountsInEth[index] || 0;

            return (
              <div key={index} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    label={`${t(`${translations}.fields.milestone_amount`)} (%)`}
                    placeholder={t(`${translations}.fields.milestone_amount`)}
                    value={percent}
                    onChange={(e) => handleMilestoneChange(index, e.target.value)}
                    type="number"
                    required
                    step="any"
                  />
                  {milestonePercentages.length > 1 && (
                    <Button type="button" variant="ghost" size="xsmall" onClick={() => removeMilestone(index)}>
                      {t(`${translations}.actions.remove`)}
                    </Button>
                  )}
                </div>
                {netAmount > 0 && percNum > 0 && (
                  <p className="text-sm text-gray-500">
                    {t(`${translations}.fields.milestone_value`)}: {formatNumber(milestoneEth)} ETH (
                    {showConversions(milestoneEth)})
                    <br />
                    {showUSDConversion(milestoneEth)}
                  </p>
                )}
              </div>
            );
          })}
          <div>
            <Button type="button" size="small" onClick={addMilestone}>
              {t(`${translations}.actions.add_milestone`)}
            </Button>
          
          </div>

          {totalMilestonesPercent > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {t(`${translations}.fields.total_milestone_percent`)}: {totalMilestonesPercent.toFixed(2)}%
              {Math.abs(totalMilestonesPercent - 100) > 0.000001 && (
                <span className="text-red-500 ml-2">{t(`${translations}.errors.sum_not_100`)}</span>
              )}
            </p>
          )}
        </div>

        <Input
          label={t(`${translations}.fields.token_address`)}
          placeholder={`${ZERO_ADDRESS} for native currency`}
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          required
        />

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <Button type="submit" size="large" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? t(`${translations}.actions.submitting`) : t(`${translations}.actions.submit`)}
        </Button>
      </form>
    </PageLayout.FixedWidth>
  );
};

export default CreateProjectPage;
