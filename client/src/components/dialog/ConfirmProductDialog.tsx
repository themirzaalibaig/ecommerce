import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
} from '@/components/ui';
import { Trash2, AlertTriangle, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { LoadingButton } from '../custom/LoadingButton';
import type { ReactNode } from 'react';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import { useState } from 'react';
import type { Product } from '@/types/models';

interface ConfirmProductDialogProps {
  id: string;
  product: Product;
  children: ReactNode;
}

export function ConfirmProductDialog({ id, product, children }: ConfirmProductDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    delete: deleteProduct,
    isMutating,
    invalidate,
    post,
  } = useApi(ENDPOINT_URLS.PRODUCTS.DELETE(id), { immediate: false });

  const handleDelete = async () => {
    try {
      // Delete thumbnail
      if (product.thumbnail?.public_id) {
        try {
          await post(ENDPOINT_URLS.USERS.IMAGE.DELETE, {
            public_id: product.thumbnail.public_id,
          });
        } catch (error) {
          console.error('Failed to delete thumbnail:', error);
        }
      }

      // Delete all product images
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.public_id) {
            try {
              await post(ENDPOINT_URLS.USERS.IMAGE.DELETE, {
                public_id: image.public_id,
              });
            } catch (error) {
              console.error('Failed to delete image:', error);
            }
          }
        }
      }

      // Delete the product
      await deleteProduct(ENDPOINT_URLS.PRODUCTS.DELETE(id));
      await invalidate(ENDPOINT_URLS.PRODUCTS.LIST);
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const totalImages = 1 + (product.images?.length || 0); // thumbnail + images

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            Delete Product
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this product? This action cannot be undone and will
            delete {totalImages} image{totalImages > 1 ? 's' : ''}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Product Details */}
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm font-medium mb-3">Product Details:</div>
            <div className="space-y-3">
              {/* Product Images Preview */}
              <div className="flex gap-2 pb-3 border-b">
                <div className="relative">
                  <img
                    src={product.thumbnail.url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <Badge variant="secondary" className="absolute -top-1 -left-1 text-xs px-1">
                    Thumb
                  </Badge>
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                    <Trash2 className="h-3 w-3 text-white" />
                  </div>
                </div>
                {product.images?.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.url}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                      <Trash2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                ))}
                {(product.images?.length || 0) > 3 && (
                  <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md border">
                    <span className="text-xs font-medium">
                      +{(product.images?.length || 0) - 3}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-semibold text-foreground max-w-[60%] text-right">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Stock:</span>
                  <Badge
                    variant={product.stock > 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {product.stock} units
                  </Badge>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-foreground">
                    {typeof product.category === 'string'
                      ? product.category
                      : product.category.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Images:</span>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    <span>{totalImages}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Warning</span>
            </div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              This will permanently delete the product{' '}
              <span className="font-semibold">{product.name}</span> and all {totalImages} associated
              images from cloud storage. This cannot be undone.
            </div>
          </div>

          {/* Impact Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
              <ShoppingBag className="h-4 w-4 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium block">Order Impact</span>
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  This product will be removed from any pending orders. Historical orders will
                  retain this product information.
                </span>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
          <LoadingButton
            isLoading={isMutating}
            onClick={handleDelete}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Product & {totalImages} Image{totalImages > 1 ? 's' : ''}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
