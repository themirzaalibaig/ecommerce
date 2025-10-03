import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button, Card, CardContent, Separator } from '@/components/ui';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '@/store/slices/cartSlice';

export const Cart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartCount = useAppSelector(selectCartCount);

  const handleIncrement = (productId: string, selectedSize?: string, selectedColor?: string) => {
    dispatch(
      incrementQuantity({
        productId,
        selectedSize: selectedSize as any,
        selectedColor,
      })
    );
  };

  const handleDecrement = (productId: string, selectedSize?: string, selectedColor?: string) => {
    dispatch(
      decrementQuantity({
        productId,
        selectedSize: selectedSize as any,
        selectedColor,
      })
    );
  };

  const handleRemove = (productId: string, selectedSize?: string, selectedColor?: string) => {
    dispatch(
      removeFromCart({
        productId,
        selectedSize: selectedSize as any,
        selectedColor,
      })
    );
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <ShopHeader onMenuToggle={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link to="/">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ShopHeader onMenuToggle={() => {}} />

      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Shopping Cart ({cartCount} items)</h1>
          </div>
          <Button variant="destructive" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative h-32 w-32 rounded-lg border bg-muted overflow-hidden shrink-0">
                      <img
                        src={item.product.thumbnail.url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link to={`/products/${item.product.slug}`} className="hover:underline">
                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product.category.name}
                          </p>
                          <div className="flex gap-4 mt-2">
                            {item.selectedSize && (
                              <span className="text-sm">
                                <span className="text-muted-foreground">Size:</span>{' '}
                                <span className="font-medium">
                                  {item.selectedSize.toUpperCase()}
                                </span>
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-sm">
                                <span className="text-muted-foreground">Color:</span>{' '}
                                <span className="font-medium capitalize">{item.selectedColor}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemove(item.product._id, item.selectedSize, item.selectedColor)
                          }
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDecrement(
                                item.product._id,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleIncrement(
                                item.product._id,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(cartTotal + cartTotal * 0.1).toFixed(2)}</span>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
