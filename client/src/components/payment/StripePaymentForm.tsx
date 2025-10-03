import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Label } from '@/components/ui';
import { Shield } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const StripePaymentForm = ({ amount, customerInfo }: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Simulate payment processing
      // In a real app, you would:
      // 1. Create payment intent on your server
      // 2. Confirm payment with stripe.confirmCardPayment()
      // 3. Handle the result

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For UI-only implementation, just navigate to success page
      navigate('/order-success');
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="card-element">Card Details *</Label>
        <div className="border rounded-md p-3 bg-background">
          <CardElement id="card-element" options={cardElementOptions} />
        </div>
        {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};
