import Stripe from 'stripe';
import { IPaymentPlan, IPaymentPlanWithDetails } from '../interfaces';
import { SubscriptionStatus } from '@prisma/client';

export const BILLING_INTERVALS = {
  MONTH: 'month',
  YEAR: 'year',
} as const;

export const DEFAULT_CURRENCY = 'usd';

export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

export const centsToDollars = (cents: number): number => {
  return cents / 100;
};

export const calculateYearlySavings = (
  monthlyAmount: number,
  yearlyAmount: number,
): number => {
  const monthlyYearlyTotal = monthlyAmount * 12;
  if (monthlyYearlyTotal <= yearlyAmount) return 0;
  return Math.round(
    ((monthlyYearlyTotal - yearlyAmount) / monthlyYearlyTotal) * 100,
  );
};

export const getPlansByInterval = (interval: string): IPaymentPlan[] => {
  return Object.values(PAYMENT_PLAN).filter(
    (plan) => plan.interval === interval,
  );
};

export const getPlanById = (
  id: string,
): (typeof PAYMENT_PLAN)[keyof typeof PAYMENT_PLAN] | undefined => {
  return Object.values(PAYMENT_PLAN).find((plan) => plan.id === id);
};

export const getAllPlans =
  (): (typeof PAYMENT_PLAN)[keyof typeof PAYMENT_PLAN][] => {
    return Object.values(PAYMENT_PLAN);
  };

export const getPlanByType = (
  type: PaymentPlanType,
): (typeof PAYMENT_PLAN)[typeof type] => {
  return PAYMENT_PLAN[type];
};

export const validatePaymentPlan = (plan: IPaymentPlan): boolean => {
  return (
    !!plan.id &&
    plan.amount > 0 &&
    !!plan.currency &&
    !!plan.interval &&
    plan.interval_count > 0
  );
};

export const PAYMENT_PLAN: Record<string, IPaymentPlanWithDetails> = {
  MONTHLY: {
    id: 'price_1SZdhdIRNdFSdSXojENZ1KGM',
    amount: 15,
    currency: DEFAULT_CURRENCY,
    interval: BILLING_INTERVALS.MONTH,
    interval_count: 1,
    name: 'Monthly Plan',
    description: 'Monthly subscription',
  },

  YEARLY: {
    id: 'price_1SZdhdIRNdFSdSXoG3m0eUXh',
    amount: 120,
    currency: DEFAULT_CURRENCY,
    interval: BILLING_INTERVALS.YEAR,
    interval_count: 1,
    name: 'Yearly Plan',
    description: 'Annual subscription (save 33%)',
    savings: calculateYearlySavings(15, 120),
  },
} as const;

export const DEFAULT_PLAN = PAYMENT_PLAN.MONTHLY;

export type PaymentPlanType = keyof typeof PAYMENT_PLAN;

export const formatAmount = (
  amount: number,
  currency: string = DEFAULT_CURRENCY,
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

export const getNextBillingDate = (
  interval: string,
  intervalCount: number,
  fromDate: Date = new Date(),
): Date => {
  const nextDate = new Date(fromDate);

  switch (interval) {
    case BILLING_INTERVALS.MONTH:
      nextDate.setMonth(nextDate.getMonth() + intervalCount);
      break;
    case BILLING_INTERVALS.YEAR:
      nextDate.setFullYear(nextDate.getFullYear() + intervalCount);
      break;
    default:
      throw new Error(`Unknown interval: ${interval}`);
  }

  return nextDate;
};

export const comparePlansByAmount = (
  a: (typeof PAYMENT_PLAN)[keyof typeof PAYMENT_PLAN],
  b: (typeof PAYMENT_PLAN)[keyof typeof PAYMENT_PLAN],
): number => {
  return a.amount - b.amount;
};

export const isYearlyPlan = (plan: IPaymentPlan): boolean => {
  return plan.interval === BILLING_INTERVALS.YEAR;
};

export const isMonthlyPlan = (plan: IPaymentPlan): boolean => {
  return plan.interval === BILLING_INTERVALS.MONTH;
};

export const mapStatus = (
  status: Stripe.Subscription.Status,
): SubscriptionStatus | 'incomplete' => {
  const map: Record<
    Stripe.Subscription.Status,
    | 'active'
    | 'trialing'
    | 'past_due'
    | 'unpaid'
    | 'canceled'
    | 'incomplete'
    | 'incomplete_expired'
  > = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    unpaid: 'unpaid',
    canceled: 'canceled',
    incomplete: 'incomplete',
    incomplete_expired: 'incomplete_expired',
    paused: 'canceled',
  };
  return map[status] || 'incomplete';
}

