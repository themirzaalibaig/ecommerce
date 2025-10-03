import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button, Card, CardContent, Separator } from '@/components/ui';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { useAppDispatch } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';

export const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Clear cart when order is successful
    dispatch(clearCart());
  }, [dispatch]);

  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <ShopHeader onMenuToggle={() => {}} />

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-6">
                  <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase. Your order has been confirmed and will be shipped
                  soon.
                </p>
              </div>

              <Separator />

              {/* Order Details */}
              <div className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4 bg-muted/50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-semibold">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold">{estimatedDelivery}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">What's Next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                      <li>• You'll receive an email confirmation shortly</li>
                      <li>• We'll send tracking information once your order ships</li>
                      <li>• You can track your order in your account</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <Button variant="outline" onClick={() => navigate('/')}>
                  Continue Shopping
                </Button>
                <Button onClick={() => navigate('/orders')}>
                  View Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-muted-foreground">
                Need help? Contact our support team at support@eshop.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
