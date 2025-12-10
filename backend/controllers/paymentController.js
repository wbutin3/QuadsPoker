import Stripe from 'stripe';
import pool from '../config/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Stripe checkout session for premium subscription
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { priceId } = req.body; // Stripe price ID for the subscription plan

    // Get user info
    const userResult = await pool.query(
      'SELECT email, stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    let customerId = user.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId.toString(),
        },
      });
      customerId = customer.id;

      // Save customer ID
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, userId]
      );
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile`,
      metadata: {
        userId: userId.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

// Stripe webhook handler
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;

      // Update user to premium
      await pool.query(
        'UPDATE users SET is_premium = true WHERE id = $1',
        [userId]
      );
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const customerId = subscription.customer;

      // Get user by customer ID
      const userResult = await pool.query(
        'SELECT id FROM users WHERE stripe_customer_id = $1',
        [customerId]
      );

      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id;
        const isPremium = subscription.status === 'active';
        const expiresAt = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null;

        await pool.query(
          'UPDATE users SET is_premium = $1, premium_expires_at = $2 WHERE id = $3',
          [isPremium, expiresAt, userId]
        );
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT is_premium, premium_expires_at, stripe_customer_id FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      isPremium: user.is_premium,
      premiumExpiresAt: user.premium_expires_at,
      hasStripeCustomer: !!user.stripe_customer_id,
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
};
