import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Folder, Image as ImageIcon, X, UploadCloud } from 'lucide-react';
import {
  Badge,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Separator,
  Textarea,
  Input,
} from '@/components/ui';
import { LoadingButton } from '../custom/LoadingButton';
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  type CategoryCreateFormData,
  type CategoryUpdateFormData,
} from '@/lib/zodValidation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { handleApiError } from '@/lib';
import type { Category, Image } from '@/types/models';

interface CategorySheetProps {
  id?: string;
  children: ReactNode;
}

export function CategorySheet({ id, children }: CategorySheetProps) {
  const [open, setOpen] = useState(false);
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { post, isMutating, put, get, invalidate, uploadFile } = useApi(
    ENDPOINT_URLS.CATEGORIES.CREATE,
    {
      immediate: false,
    }
  );

  const form = useForm<CategoryCreateFormData | CategoryUpdateFormData>({
    resolver: zodResolver(id ? categoryUpdateSchema : categoryCreateSchema) as Resolver<
      CategoryCreateFormData | CategoryUpdateFormData
    >,
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image: undefined,
    },
  });

  const getCategory = useCallback(async () => {
    if (id && open) {
      try {
        const { data } = await get<{ category: Category }>(ENDPOINT_URLS.CATEGORIES.DETAIL(id), {
          silent: true,
        });
        form.reset({
          name: data.category.name,
          slug: data.category.slug,
          description: data.category.description || '',
          image: data.category.image || undefined,
        });
        // Clear the file input since we're editing an existing category
        setCategoryImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    }
  }, [id, open]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

  const watchedName = form.watch('name');
  const watchedSlug = form.watch('slug');
  const watchedImage = form.watch('image');

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      form.setValue(
        'image',
        {
          url: previewUrl,
          public_id: '',
        },
        { shouldValidate: true }
      );
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      form.setValue(
        'image',
        {
          url: previewUrl,
          public_id: '',
        },
        { shouldValidate: true }
      );
    }
  };

  const handleRemoveImage = async () => {
    // If editing and removing an existing image, delete it from cloud storage
    if (id && watchedImage?.public_id && !categoryImage) {
      try {
        await post(ENDPOINT_URLS.USERS.IMAGE.DELETE, {
          public_id: watchedImage.public_id,
        });
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }

    setCategoryImage(null);
    form.setValue('image', undefined, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (data: CategoryCreateFormData | CategoryUpdateFormData) => {
    try {
      // If editing and a new image was selected, delete the old image first
      if (id && categoryImage && watchedImage?.public_id) {
        try {
          await post(ENDPOINT_URLS.USERS.IMAGE.DELETE, {
            public_id: watchedImage.public_id,
          });
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }

      // Upload new image if a file was selected
      if (categoryImage) {
        const formData = new FormData();
        formData.append('file', categoryImage);
        formData.append('folder', 'categories');
        const { response } = await uploadFile(ENDPOINT_URLS.USERS.IMAGE.UPLOAD, formData);
        if (response.success) {
          data.image = {
            url: (response.data as Image)?.url as string,
            public_id: (response.data as Image)?.public_id as string,
          };
        }
      }

      if (id) {
        await put(ENDPOINT_URLS.CATEGORIES.UPDATE(id), data);
      } else {
        await post(ENDPOINT_URLS.CATEGORIES.CREATE, data);
      }

      await invalidate(ENDPOINT_URLS.CATEGORIES.LIST);
      setOpen(false);
      form.reset({
        name: '',
        slug: '',
        description: '',
        image: undefined,
      });
      setCategoryImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      handleApiError(error, form.setError);
      console.error('Error submitting category:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full overflow-hidden">
        <SheetHeader className="space-y-3 pb-6 px-6 pt-6">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
              <Folder className="h-4 w-4" />
            </div>
            {id ? 'Edit Category' : 'Add New Category'}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {id
              ? 'Update category details and settings.'
              : 'Create a new category for your products.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
          <Form {...form}>
            <form
              id="category-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 pb-8"
            >
              {/* Category Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
                    <Folder className="h-3 w-3" />
                  </div>
                  <h3 className="text-sm font-medium">Category Details</h3>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name..." {...field} />
                      </FormControl>
                      <FormDescription>The display name for this category.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="category-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL-friendly identifier (e.g. "electronics").
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter category description..."
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Short description for this category.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Uploader with Drag and Drop */}
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <div
                        className={cn(
                          'relative flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 transition-colors',
                          dragActive ? 'border-blue-500 bg-blue-50' : 'border-muted'
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        tabIndex={0}
                        role="button"
                        aria-label="Upload image"
                        onClick={handleClickUpload}
                        style={{ cursor: 'pointer' }}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          tabIndex={-1}
                        />
                        <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground mb-1">
                          Drag & drop an image here, or{' '}
                          <span className="underline">click to upload</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG, JPEG, GIF up to 5MB
                        </span>
                        {watchedImage?.url && (
                          <div className="mt-4 flex flex-col items-center gap-2">
                            <div className="relative">
                              <img
                                src={watchedImage.url}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded border"
                              />
                              {id && !categoryImage && (
                                <Badge
                                  variant="secondary"
                                  className="absolute -top-2 -right-2 text-xs"
                                >
                                  Current
                                </Badge>
                              )}
                              {categoryImage && (
                                <Badge
                                  variant="default"
                                  className="absolute -top-2 -right-2 text-xs"
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                            <button
                              type="button"
                              className="text-xs text-red-500 hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage();
                              }}
                            >
                              Remove image
                            </button>
                          </div>
                        )}
                      </div>
                      <FormDescription>
                        Optional image for this category. Drag & drop or click to upload.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preview */}
              {(watchedName || watchedSlug || watchedImage?.url) && (
                <div className="space-y-3">
                  <Separator />
                  <div className="flex flex-wrap gap-2 items-center">
                    {watchedName && (
                      <Badge variant="secondary" className="text-xs">
                        {watchedName}
                      </Badge>
                    )}
                    {watchedSlug && (
                      <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                        {watchedSlug}
                      </Badge>
                    )}
                    {watchedImage?.url && (
                      <span className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <img
                          src={watchedImage.url}
                          alt="Category"
                          style={{
                            width: 32,
                            height: 32,
                            objectFit: 'cover',
                            borderRadius: 4,
                            border: '1px solid #eee',
                          }}
                        />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>

        {/* Footer with action buttons */}
        <div className="border-t bg-background px-6 py-4 mt-auto">
          <div className="flex gap-4">
            <LoadingButton
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isMutating}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </LoadingButton>
            <LoadingButton
              type="submit"
              form="category-form"
              isLoading={isMutating}
              disabled={isMutating}
              className="flex-1"
            >
              {id ? 'Update Category' : 'Create Category'}
            </LoadingButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CategorySheet;
