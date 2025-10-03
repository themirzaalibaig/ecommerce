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
import { Trash2, AlertTriangle, FolderX, Image as ImageIcon } from 'lucide-react';
import { LoadingButton } from '../custom/LoadingButton';
import type { ReactNode } from 'react';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import { useState } from 'react';
import type { Category } from '@/types/models';

interface ConfirmCategoryDialogProps {
  id: string;
  category: Category;
  children: ReactNode;
}

export function ConfirmCategoryDialog({ id, category, children }: ConfirmCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    delete: deleteCategory,
    isMutating,
    invalidate,
    post,
  } = useApi(ENDPOINT_URLS.CATEGORIES.DELETE(id), { immediate: false });

  const handleDelete = async () => {
    try {
      // Delete image from cloudinary if it exists
      if (category.image?.public_id) {
        try {
          await post(ENDPOINT_URLS.USERS.IMAGE.DELETE, {
            public_id: category.image.public_id,
          });
        } catch (error) {
          console.error('Failed to delete image:', error);
          // Continue with category deletion even if image deletion fails
        }
      }

      // Delete the category
      await deleteCategory(ENDPOINT_URLS.CATEGORIES.DELETE(id));
      await invalidate(ENDPOINT_URLS.CATEGORIES.LIST);
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            Delete Category
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this category? This action cannot be undone and will
            also delete the associated image.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Category Details */}
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm font-medium mb-3">Category Details:</div>
            <div className="space-y-3">
              {/* Category Image */}
              {category.image?.url && (
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="relative">
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                      <Trash2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground mb-1">Image will be deleted</div>
                    <div className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      <span className="truncate">{category.image.public_id}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Info */}
              <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-semibold text-foreground max-w-[60%] text-right">
                    {category.name}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Slug:</span>
                  <Badge variant="secondary" className="text-xs font-mono">
                    {category.slug}
                  </Badge>
                </div>
                {category.description && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="text-xs text-foreground bg-background p-2 rounded border">
                      {category.description}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(category.createdAt).toLocaleDateString()}</span>
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
              {category.image?.url ? (
                <>
                  This will permanently delete the category{' '}
                  <span className="font-semibold">{category.name}</span> and its associated image
                  from cloud storage. This cannot be undone.
                </>
              ) : (
                <>
                  This will permanently delete the category{' '}
                  <span className="font-semibold">{category.name}</span>. This cannot be undone.
                </>
              )}
            </div>
          </div>

          {/* Impact Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
              <FolderX className="h-4 w-4 mt-0.5" />
              <div className="flex-1">
                <span className="text-sm font-medium block">Products Impact</span>
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  Products assigned to this category may be affected. Please reassign products
                  before deletion if needed.
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
            {category.image?.url ? 'Delete Category & Image' : 'Delete Category'}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
