import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Check, Minus, Plus } from 'lucide-react';
import {
  Button,
  Badge,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { ShopHeader } from '@/components/shop/ShopHeader';
import { CartSheet } from '@/components/shop/CartSheet';
import { dummyProducts, availableColors } from '@/data/products';
import { useAppDispatch } from '@/store';
import { addToCart, openCart } from '@/store/slices/cartSlice';
import { toast } from 'react-toastify';
import type { Size } from '@/types/models';

export const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const product = dummyProducts.find((p) => p.slug === slug);

  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <ShopHeader onMenuToggle={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product not found</h1>
            <Button onClick={() => navigate('/')}>Back to Shop</Button>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  const handleAddToCart = () => {
    if (product.size.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    dispatch(
      addToCart({
        product,
        quantity,
        selectedSize,
        selectedColor,
      })
    );
    dispatch(openCart());
    toast.success('Added to cart!');
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="min-h-screen flex flex-col">
      <ShopHeader onMenuToggle={() => {}} />

      <div className="container py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
              <img
                src={images[currentImage].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-lg border overflow-hidden ${
                      currentImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category.name}</Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mt-4">${product.price.toFixed(2)}</p>
            </div>

            <Separator />

            <p className="text-muted-foreground">{product.description}</p>

            {/* Size Selection */}
            {product.size.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Select Size {selectedSize && <Check className="inline h-4 w-4 text-green-500" />}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.size.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      className="w-14"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Select Color (Optional){' '}
                {selectedColor && <Check className="inline h-4 w-4 text-green-500" />}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableColors.slice(0, 4).map((color) => (
                  <button
                    key={color.value}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'border-muted-foreground/20'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-3 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={decrementQuantity}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Out of Stock</span>
                </>
              )}
            </div>

            <Separator />

            {/* Additional Info */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">
                  Description
                </TabsTrigger>
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{product.category.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tags</dt>
                    <dd className="font-medium">{product.tags.join(', ')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total Sold</dt>
                    <dd className="font-medium">{product.totalSold}</dd>
                  </div>
                </dl>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <CartSheet />
    </div>
  );
};
