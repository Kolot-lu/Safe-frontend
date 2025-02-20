import * as yup from 'yup';

/**
 * Creates a validation schema for the Create Project form.
 *
 * @param {Function} t - Translation function.
 * @returns {yup.ObjectSchema} The validation schema.
 */
export const createProjectValidationSchema = (t: (key: string) => string) =>
  yup.object().shape({
    executor: yup.string().required(t('pages.create_project.errors.executor_required')),
    totalAmount: yup
      .number()
      .positive(t('pages.create_project.errors.total_amount_positive'))
      .required(t('pages.create_project.errors.total_amount_required')),
    platformFee: yup
      .number()
      .min(1, t('pages.create_project.errors.platform_fee_positive'))
      .required(t('pages.create_project.errors.platform_fee_required')),
    token: yup
      .object({
        name: yup.string().required(),
        address: yup.string().required(),
      })
      .required(t('pages.create_project.errors.token_address_required')),

    milestonePercentages: yup
      .array()
      .of(yup.number().required(t('pages.create_project.errors.milestone_percentage_required')))
      .test(
        'total-100',
        t('pages.create_project.fields.milestone.not_enough'),
        (values) => values && values.reduce((sum: number, value: number) => sum + value, 0) === 100
      )
      .required(t('pages.create_project.errors.milestones_required')),
      useInfiniteAllowance: yup.boolean().required(),
  });
