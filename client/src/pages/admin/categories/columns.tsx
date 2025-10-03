import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '@/types/models';
import { format } from 'date-fns';
import { CategorySheet } from '@/components/sheet/CategorySheet';
import { Button } from '@/components/ui';
import { Pencil, Trash2 } from 'lucide-react';
import { ConfirmCategoryDialog } from '@/components/dialog/ConfirmCategoryDialog';

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: (info) => {
      const value = info.getValue() as string | Date;
      const date = value ? new Date(value) : null;
      return date ? format(date, 'PPP') : '';
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: (info) => {
      // image is expected to be an object with a url property
      const image = info.row.original.image as { url?: string } | undefined;
      if (image && image.url) {
        return (
          <img
            src={image.url}
            alt="Category"
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
        );
      }
      return <span>No image</span>;
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: (info) => {
      return (
        <div className="flex gap-2">
          <CategorySheet id={info.row.original._id}>
            <Button variant="outline" size="icon" className="text-primary" title="Edit">
              <Pencil size={18} />
            </Button>
          </CategorySheet>
          <ConfirmCategoryDialog id={info.row.original._id} category={info.row.original}>
            <Button variant="outline" size="icon" className="text-destructive" title="Delete">
              <Trash2 size={18} />
            </Button>
          </ConfirmCategoryDialog>
        </div>
      );
    },
  },
];
