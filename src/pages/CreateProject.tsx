import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/Layout/Page/PageLayout';
import Button from '../components/ui/Button';
import { useBlockchain } from '../hooks/useBlockchain';
import Input from '../components/ui/Inbut';

const translations = 'pages.create_project';

const CreateProjectPage: React.FC = () => {
  const { contractService, signer } = useBlockchain();
  const { t } = useTranslation();

  // State for form inputs
  const [executor, setExecutor] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [milestoneAmounts, setMilestoneAmounts] = useState<string[]>(['']);
  const [platformFeePercent, setPlatformFeePercent] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handles form submission.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Validate inputs (example validation)
      if (!executor || !totalAmount || !platformFeePercent || !tokenAddress || milestoneAmounts.some((amount) => !amount)) {
        throw new Error(t(`${translations}.errors.invalid_input`));
      }

      // Call createProject
      if (!contractService) {
        throw new Error(t(`${translations}.errors.no_contract_service`));
      }
      if (!signer) {
        throw new Error(t(`${translations}.errors.no_signer`));
      }
      await contractService.createProject(
        executor,
        totalAmount,
        milestoneAmounts,
        parseInt(platformFeePercent, 10),
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
   * Handles dynamic milestone input changes.
   */
  const handleMilestoneChange = (index: number, value: string) => {
    const updatedMilestones = [...milestoneAmounts];
    updatedMilestones[index] = value;
    setMilestoneAmounts(updatedMilestones);
  };

  /**
   * Adds a new milestone input.
   */
  const addMilestone = () => setMilestoneAmounts([...milestoneAmounts, '']);

  /**
   * Removes a milestone input.
   */
  const removeMilestone = (index: number) => {
    const updatedMilestones = milestoneAmounts.filter((_, i) => i !== index);
    setMilestoneAmounts(updatedMilestones);
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

        <Input
          label={t(`${translations}.fields.total_amount`)}
          placeholder="0.0 ETH"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          type="number"
          required
        />

        <div>
          <label className="block font-medium mb-2">{t(`${translations}.fields.milestones`)}</label>
          {milestoneAmounts.map((amount, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <Input
                placeholder={t(`${translations}.fields.milestone_amount`)}
                value={amount}
                onChange={(e) => handleMilestoneChange(index, e.target.value)}
                type="number"
                required
              />
              {milestoneAmounts.length > 1 && (
                <Button type="button" variant="ghost" size="xsmall" onClick={() => removeMilestone(index)}>
                  {t(`${translations}.actions.remove`)}
                </Button>
              )}
            </div>
          ))}
          <Button type="button" size="small" onClick={addMilestone}>
            {t(`${translations}.actions.add_milestone`)}
          </Button>
        </div>

        <Input
          label={t(`${translations}.fields.platform_fee`)}
          placeholder="e.g. 5%"
          value={platformFeePercent}
          onChange={(e) => setPlatformFeePercent(e.target.value)}
          type="number"
          required
        />

        <Input
          label={t(`${translations}.fields.token_address`)}
          placeholder="0x123..."
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
