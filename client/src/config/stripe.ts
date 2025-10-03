import { loadStripe } from '@stripe/stripe-js';


const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51DummyKeyForDevelopment';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
