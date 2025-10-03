import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import type { Product } from '@/types/models';
import { useAppDispatch } from '@/store';
import { addToCart, openCart } from '@/store/slices/cartSlice';
import { toast } from 'react-toastify';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    // Select first size and color if available
    const selectedSize = product.size.length > 0 ? product.size[0] : undefined;
    const selectedColor = product.color.length > 0 ? product.color[0] : undefined;

    dispatch(
      addToCart({
        product,
        quantity: 1,
        selectedSize,
        selectedColor,
      })
    );
    dispatch(openCart());
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.thumbnail.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {product.totalSold > 100 && <Badge className="absolute top-2 right-2">Popular</Badge>}
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-full items-center justify-center">
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={handleQuickAdd}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-1">
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
          </div>
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.size.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {product.size.length} sizes available
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
