import type { ColumnDef } from '@tanstack/react-table';
import type { Category } from '@/types/models';
import { format } from 'date-fns';

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
];
