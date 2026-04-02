import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2024-04-10' as Stripe.LatestApiVersion
});

export async function createCustomer(params: {
	email: string;
	name: string;
	tenantId: string;
}) {
	return await stripe.customers.create({
		email: params.email,
		name: params.name,
		metadata: {
			tenant_id: params.tenantId
		}
	});
}

export async function createSubscription(params: {
	customerId: string;
	priceId: string;
	trialDays?: number;
}) {
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

export const PRICE_IDS = {
	starter: process.env.STRIPE_PRICE_STARTER!,
	professional: process.env.STRIPE_PRICE_PROFESSIONAL!,
	enterprise: process.env.STRIPE_PRICE_ENTERPRISE!
};
