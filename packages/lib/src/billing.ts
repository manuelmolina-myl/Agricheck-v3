import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe(secretKey: string): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2024-04-10' as Stripe.LatestApiVersion
    });
  }
  return stripeInstance;
}

export async function createCustomer(
  secretKey: string,
  params: {
    email: string;
    name: string;
    tenantId: string;
  }
) {
  const stripe = getStripe(secretKey);
  return await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      tenant_id: params.tenantId
    }
  });
}

export async function createSubscription(
  secretKey: string,
  params: {
    customerId: string;
    priceId: string;
    trialDays?: number;
  }
) {
  const stripe = getStripe(secretKey);
  return await stripe.subscriptions.create({
    customer: params.customerId,
    items: [{ price: params.priceId }],
    trial_period_days: params.trialDays,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription'
    },
    expand: ['latest_invoice.payment_intent']
  });
}

export async function cancelSubscription(secretKey: string, subscriptionId: string) {
  const stripe = getStripe(secretKey);
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function getSubscription(secretKey: string, subscriptionId: string) {
  const stripe = getStripe(secretKey);
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function createBillingPortalSession(
  secretKey: string,
  params: {
    customerId: string;
    returnUrl: string;
  }
) {
  const stripe = getStripe(secretKey);
  return await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl
  });
}

export const PLAN_LIMITS = {
  starter: { maxWorkers: 50, maxRanches: 1 },
  professional: { maxWorkers: 200, maxRanches: 5 },
  enterprise: { maxWorkers: 500, maxRanches: 20 }
} as const;
