import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShoppingBag, UploadCloud, Trash2, Plus } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@/components/ui';
import { LoadingButton } from '../custom/LoadingButton';
import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateFormData,
  type ProductUpdateFormData,
} from '@/lib/zodValidation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { handleApiError } from '@/lib';
import type { Product, Image, Category, Size } from '@/types/models';

interface ProductSheetProps {
  id?: string;
  children: ReactNode;
}

const SIZES: Size[] = ['xs', 's', 'm', 'l', 'xl'];

const AVAILABLE_COLORS = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Gray', value: 'gray', hex: '#6B7280' },
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Yellow', value: 'yellow', hex: '#F59E0B' },
  { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
  { name: 'Pink', value: 'pink', hex: '#EC4899' },
  { name: 'Orange', value: 'orange', hex: '#F97316' },
];

export function ProductSheet({ id, children }: ProductSheetProps) {
  const [open, setOpen] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [tagInput, setTagInput] = useState('');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const { post, isMutating, put, get, invalidate, uploadFile } = useApi(
    ENDPOINT_URLS.PRODUCTS.CREATE,
    {
      immediate: false,
    }
  );

  // Fetch categories for dropdown
  const { data: categoriesData } = useApi<{ categories: Category[] }>(
    ENDPOINT_URLS.CATEGORIES.LIST
  );

  const form = useForm<ProductCreateFormData | ProductUpdateFormData>({
    resolver: zodResolver(id ? productUpdateSchema : productCreateSchema) as Resolver<
      ProductCreateFormData | ProductUpdateFormData
    >,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      tags: [],
      color: [],
      thumbnail: { url: '', public_id: '' },
      images: [],
      stock: 0,
      category: '',
      size: [],
    },
  });

  const getProduct = useCallback(async () => {
    if (id && open) {
      try {
        const { data } = await get<{ product: Product }>(ENDPOINT_URLS.PRODUCTS.DETAIL(id), {
          silent: true,
        });
        form.reset({
          name: data.product.name,
          description: data.product.description,
          price: data.product.price,
          tags: data.product.tags || [],
          color: data.product.color || [],
          thumbnail: data.product.thumbnail,
          images: data.product.images || [],
          stock: data.product.stock,
          category:
            typeof data.product.category === 'string'
              ? data.product.category
              : data.product.category._id,
          size: data.product.size || [],
        });
        setThumbnailFile(null);
        setImageFiles([]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    }
  }, [id, open]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const watchedThumbnail = form.watch('thumbnail');
  const watchedImages = form.watch('images');
  const watchedSize = form.watch('size');
  const watchedTags = form.watch('tags');
  const watchedColors = form.watch('color');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const previewUrl = URL.createObjectURL(file);
      form.setValue('thumbnail', { url: previewUrl, public_id: '' }, { shouldValidate: true });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentImages = form.getValues('images') || [];
      if (currentImages.length + files.length > 10) {
        alert('Maximum 10 images allowed');
        return;
      }

      setImageFiles([...imageFiles, ...files]);
      const newImages = files.map((file) => ({
        url: URL.createObjectURL(file),
        public_id: '',
      }));
      form.setValue('images', [...currentImages, ...newImages], { shouldValidate: true });
    }
  };

  const handleRemoveImage = async (index: number) => {
    const images = form.getValues('images') || [];
    const imageToRemove = images[index];

    // If it's an existing image (has public_id and not a new upload)
    if (imageToRemove.public_id && index >= imageFiles.length) {
      try {
        await post(ENDPOINT_URLS.USERS.IMAGE.DELETE, {
          public_id: imageToRemove.public_id,
        });
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }

    // Remove from file list if it's a new upload
    if (index < imageFiles.length) {
      const newFiles = [...imageFiles];
      newFiles.splice(index, 1);
      setImageFiles(newFiles);
    }

    // Remove from form
    const newImages = [...images];
    newImages.splice(index, 1);
    form.setValue('images', newImages, { shouldValidate: true });
  };

  const handleSubmit = async (data: ProductCreateFormData | ProductUpdateFormData) => {
    try {
      // Upload thumbnail if new file selected
      if (thumbnailFile) {
        // Delete old thumbnail if editing
        if (id && watchedThumbnail?.public_id) {
          try {
            await post(ENDPOINT_URLS.USERS.IMAGE.DELETE, { public_id: watchedThumbnail.public_id });
          } catch (error) {
            console.error('Failed to delete old thumbnail:', error);
          }
        }

        const formData = new FormData();
        formData.append('file', thumbnailFile);
        formData.append('folder', 'products/thumbnails');
        const { response } = await uploadFile(ENDPOINT_URLS.USERS.IMAGE.UPLOAD, formData);
        if (response.success) {
          data.thumbnail = {
            url: (response.data as Image)?.url as string,
            public_id: (response.data as Image)?.public_id as string,
          };
        }
      }

      // Upload new images
      if (imageFiles.length > 0) {
        const uploadedImages: Image[] = [];
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'products/images');
          const { response } = await uploadFile(ENDPOINT_URLS.USERS.IMAGE.UPLOAD, formData);
          if (response.success) {
            uploadedImages.push({
              url: (response.data as Image)?.url as string,
              public_id: (response.data as Image)?.public_id as string,
            });
          }
        }

        // Merge with existing images (filter out new ones)
        const existingImages = (data.images || []).filter((img) => img.public_id);
        data.images = [...existingImages, ...uploadedImages];
      }

      if (id) {
        await put(ENDPOINT_URLS.PRODUCTS.UPDATE(id), data);
      } else {
        await post(ENDPOINT_URLS.PRODUCTS.CREATE, data);
      }

      await invalidate(ENDPOINT_URLS.PRODUCTS.LIST);
      setOpen(false);
      form.reset();
      setThumbnailFile(null);
      setImageFiles([]);
    } catch (error) {
      handleApiError(error, form.setError);
      console.error('Error submitting product:', error);
    }
  };

  const handleSizeToggle = (size: Size) => {
    const currentSizes = watchedSize || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    form.setValue('size', newSizes, { shouldValidate: true });
  };

  const handleColorToggle = (color: string) => {
    const currentColors = watchedColors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    form.setValue('color', newColors, { shouldValidate: true });
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = watchedTags || [];
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()], { shouldValidate: true });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = watchedTags || [];
    form.setValue(
      'tags',
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col h-full overflow-hidden">
        <SheetHeader className="space-y-3 pb-6 px-6 pt-6">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
              <ShoppingBag className="h-4 w-4" />
            </div>
            {id ? 'Edit Product' : 'Add New Product'}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {id ? 'Update product details and settings.' : 'Create a new product for your store.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <Form {...form}>
            <form
              id="product-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 pb-8"
            >
              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Product Details</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name..." {...field} />
                      </FormControl>
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
                          placeholder="Enter product description..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesData?.categories?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Sizes */}
              <div className="space-y-3">
                <FormLabel>Available Sizes</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => (
                    <div key={size} className="flex items-center">
                      <Button
                        type="button"
                        variant={watchedSize?.includes(size) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size.toUpperCase()}
                      </Button>
                    </div>
                  ))}
                </div>
                <FormDescription>Select available sizes for this product</FormDescription>
              </div>

              <Separator />

              {/* Colors */}
              <div className="space-y-3">
                <FormLabel>Available Colors</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        watchedColors?.includes(color.value)
                          ? 'ring-2 ring-primary ring-offset-2 border-primary'
                          : 'border-muted-foreground/20'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorToggle(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
                <FormDescription>Select available colors for this product</FormDescription>
                {watchedColors && watchedColors.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {watchedColors.map((color) => {
                      const colorData = AVAILABLE_COLORS.find((c) => c.value === color);
                      return (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {colorData?.name || color}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTag} variant="secondary">
                    Add
                  </Button>
                </div>
                {watchedTags && watchedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {watchedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <FormDescription>Add tags to help customers find this product</FormDescription>
              </div>

              <Separator />

              {/* Thumbnail */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <div className="space-y-2">
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="w-full"
                      >
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Upload Thumbnail
                      </Button>
                      {watchedThumbnail?.url && (
                        <div className="relative w-32 h-32">
                          <img
                            src={watchedThumbnail.url}
                            alt="Thumbnail"
                            className="w-full h-full object-cover rounded border"
                          />
                          {thumbnailFile && (
                            <Badge variant="default" className="absolute -top-2 -right-2 text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Images */}
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <div className="space-y-2">
                      <input
                        ref={imagesInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImagesChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => imagesInputRef.current?.click()}
                        className="w-full"
                        disabled={(watchedImages?.length || 0) >= 10}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Images ({watchedImages?.length || 0}/10)
                      </Button>
                      {watchedImages && watchedImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {watchedImages.map((img, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={img.url}
                                alt={`Product ${index + 1}`}
                                className="w-full aspect-square object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription>Upload 1-10 product images</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="border-t bg-background px-6 py-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isMutating}
              className="flex-1"
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              form="product-form"
              isLoading={isMutating}
              disabled={isMutating}
              className="flex-1"
            >
              {id ? 'Update Product' : 'Create Product'}
            </LoadingButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ProductSheet;
