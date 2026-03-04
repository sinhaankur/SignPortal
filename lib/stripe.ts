import Stripe from 'stripe'

// ============================================================================
// Types
// ============================================================================

export type SupportedCurrency = 'usd' | 'eur' | 'gbp' | 'inr' | 'aud' | 'cad' | 'jpy'

export interface PricingPlan {
  id: string
  name: string
  description: string
  features: string[]
  prices: Record<SupportedCurrency, {
    monthly: number
    yearly: number
  }>
  limits: {
    users: number
    documents: number
    storage: number // in GB
  }
  stripePriceIds?: Record<SupportedCurrency, {
    monthly: string
    yearly: string
  }>
}

export interface SubscriptionDetails {
  id: string
  status: Stripe.Subscription.Status
  planId: string
  currency: SupportedCurrency
  billingCycle: 'monthly' | 'yearly'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export interface CustomerPortalSession {
  url: string
}

export interface CheckoutSession {
  url: string
  sessionId: string
}

// ============================================================================
// Pricing Plans Configuration
// ============================================================================

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started with e-signatures',
    features: [
      'Up to 5 users',
      '100 documents/month',
      '5 GB storage',
      'Basic templates',
      'Email support',
      'Mobile signing',
    ],
    prices: {
      usd: { monthly: 1500, yearly: 15000 }, // $15/mo, $150/yr
      eur: { monthly: 1400, yearly: 14000 },
      gbp: { monthly: 1200, yearly: 12000 },
      inr: { monthly: 99900, yearly: 999900 }, // ₹999/mo
      aud: { monthly: 2200, yearly: 22000 },
      cad: { monthly: 2000, yearly: 20000 },
      jpy: { monthly: 200000, yearly: 2000000 },
    },
    limits: { users: 5, documents: 100, storage: 5 },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing businesses with advanced workflow needs',
    features: [
      'Up to 25 users',
      '500 documents/month',
      '25 GB storage',
      'Custom templates',
      'Workflow builder',
      'API access',
      'Priority support',
      'Audit logs',
    ],
    prices: {
      usd: { monthly: 4900, yearly: 49000 }, // $49/mo, $490/yr
      eur: { monthly: 4500, yearly: 45000 },
      gbp: { monthly: 3900, yearly: 39000 },
      inr: { monthly: 299900, yearly: 2999900 },
      aud: { monthly: 7200, yearly: 72000 },
      cad: { monthly: 6500, yearly: 65000 },
      jpy: { monthly: 650000, yearly: 6500000 },
    },
    limits: { users: 25, documents: 500, storage: 25 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full-featured solution for large organizations',
    features: [
      'Unlimited users',
      'Unlimited documents',
      '100 GB storage',
      'SSO / SAML integration',
      'Custom branding',
      'Dedicated support',
      'SLA guarantee',
      'Offline mode',
      'Advanced analytics',
      'Custom integrations',
    ],
    prices: {
      usd: { monthly: 19900, yearly: 199000 },
      eur: { monthly: 18500, yearly: 185000 },
      gbp: { monthly: 15900, yearly: 159000 },
      inr: { monthly: 999900, yearly: 9999900 },
      aud: { monthly: 29900, yearly: 299000 },
      cad: { monthly: 26900, yearly: 269000 },
      jpy: { monthly: 2500000, yearly: 25000000 },
    },
    limits: { users: -1, documents: -1, storage: 100 },
  },
]

// Currency display info
export const CURRENCY_INFO: Record<SupportedCurrency, { symbol: string; name: string; locale: string }> = {
  usd: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  eur: { symbol: '€', name: 'Euro', locale: 'de-DE' },
  gbp: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
  inr: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  aud: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  cad: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  jpy: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
}

// ============================================================================
// Stripe Service
// ============================================================================

class StripeService {
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia',
    })
  }

  // ============================================================================
  // Customer Management
  // ============================================================================

  async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
      metadata,
    })
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId)
      if (customer.deleted) return null
      return customer as Stripe.Customer
    } catch {
      return null
    }
  }

  async updateCustomer(
    customerId: string,
    data: Stripe.CustomerUpdateParams
  ): Promise<Stripe.Customer> {
    return this.stripe.customers.update(customerId, data)
  }

  // ============================================================================
  // Checkout & Subscriptions
  // ============================================================================

  async createCheckoutSession(
    customerId: string,
    planId: string,
    currency: SupportedCurrency,
    billingCycle: 'monthly' | 'yearly',
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    const plan = PRICING_PLANS.find(p => p.id === planId)
    if (!plan) throw new Error('Invalid plan')

    const priceId = plan.stripePriceIds?.[currency]?.[billingCycle]
    
    // If no Stripe price ID configured, create a dynamic price
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
      ? [{ price: priceId, quantity: 1 }]
      : [{
          price_data: {
            currency,
            product_data: {
              name: `SignPortal ${plan.name}`,
              description: plan.description,
            },
            unit_amount: plan.prices[currency][billingCycle],
            recurring: {
              interval: billingCycle === 'monthly' ? 'month' : 'year',
            },
          },
          quantity: 1,
        }]

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          planId,
          billingCycle,
        },
      },
    })

    return {
      url: session.url!,
      sessionId: session.id,
    }
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionDetails | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
      
      return {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.metadata.planId || '',
        currency: (subscription.currency as SupportedCurrency) || 'usd',
        billingCycle: subscription.metadata.billingCycle as 'monthly' | 'yearly' || 'monthly',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      }
    } catch {
      return null
    }
  }

  async cancelSubscription(subscriptionId: string, atPeriodEnd = true): Promise<boolean> {
    try {
      if (atPeriodEnd) {
        await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        })
      } else {
        await this.stripe.subscriptions.cancel(subscriptionId)
      }
      return true
    } catch {
      return false
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      })
      return true
    } catch {
      return false
    }
  }

  // ============================================================================
  // Customer Portal
  // ============================================================================

  async createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<CustomerPortalSession> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: session.url }
  }

  // ============================================================================
  // Invoices
  // ============================================================================

  async getInvoices(customerId: string, limit = 10): Promise<Stripe.Invoice[]> {
    const invoices = await this.stripe.invoices.list({
      customer: customerId,
      limit,
    })
    return invoices.data
  }

  async getUpcomingInvoice(customerId: string): Promise<Stripe.UpcomingInvoice | null> {
    try {
      return await this.stripe.invoices.retrieveUpcoming({
        customer: customerId,
      })
    } catch {
      return null
    }
  }

  // ============================================================================
  // Webhooks
  // ============================================================================

  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
  ): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }

  // ============================================================================
  // Usage Reporting (for metered billing)
  // ============================================================================

  async reportUsage(
    subscriptionItemId: string,
    quantity: number,
    timestamp?: number
  ): Promise<boolean> {
    try {
      await this.stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
        quantity,
        timestamp: timestamp || Math.floor(Date.now() / 1000),
        action: 'increment',
      })
      return true
    } catch {
      return false
    }
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

export function formatPrice(
  amount: number,
  currency: SupportedCurrency
): string {
  const info = CURRENCY_INFO[currency]
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export function getPlanByPriceId(priceId: string): PricingPlan | undefined {
  for (const plan of PRICING_PLANS) {
    if (!plan.stripePriceIds) continue
    for (const currency of Object.keys(plan.stripePriceIds) as SupportedCurrency[]) {
      const prices = plan.stripePriceIds[currency]
      if (prices.monthly === priceId || prices.yearly === priceId) {
        return plan
      }
    }
  }
  return undefined
}

// Export singleton
export const stripeService = new StripeService()
export default stripeService
