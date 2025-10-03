import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Button,
  Separator,
  ScrollArea,
} from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectCartItems,
  selectCartTotal,
  selectIsCartOpen,
  closeCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from '@/store/slices/cartSlice';

export const CartSheet = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const isOpen = useAppSelector(selectIsCartOpen);

  const handleClose = () => {
    dispatch(closeCart());
  };

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

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartItems.length})</SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-2">Add some products to get started</p>
            <Button className="mt-6" onClick={handleClose} asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-10">
              <div className="space-y-4 py-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-lg border bg-muted overflow-hidden">
                      <img
                        src={item.product.thumbnail.url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                          {item.selectedSize && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Size: {item.selectedSize.toUpperCase()}
                            </p>
                          )}
                          {item.selectedColor && (
                            <p className="text-xs text-muted-foreground">
                              Color: {item.selectedColor}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleRemove(item.product._id, item.selectedSize, item.selectedColor)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleDecrement(
                                item.product._id,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleIncrement(
                                item.product._id,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <SheetFooter className="flex-col gap-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="grid gap-2">
                <Button asChild onClick={handleClose}>
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button variant="outline" asChild onClick={handleClose}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
