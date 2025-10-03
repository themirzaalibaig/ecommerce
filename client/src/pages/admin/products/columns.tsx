import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import type { Product } from '@/types/models';
import { ProductSheet } from '@/components/sheet/ProductSheet';
import { ConfirmProductDialog } from '@/components/dialog/ConfirmProductDialog';

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'thumbnail',
    header: 'Image',
    cell: ({ row }) => {
      const product = row.original;
      return (
        <img
          src={product.thumbnail.url}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-md"
        />
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge variant="secondary">{typeof category === 'string' ? category : category.name}</Badge>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return <div className="font-medium">${price.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number;
      return <Badge variant={stock > 0 ? 'default' : 'destructive'}>{stock} units</Badge>;
    },
  },
  {
    accessorKey: 'size',
    header: 'Sizes',
    cell: ({ row }) => {
      const sizes = row.original.size || [];
      return (
        <div className="flex gap-1 flex-wrap">
          {sizes.slice(0, 3).map((size) => (
            <Badge key={size} variant="outline" className="text-xs">
              {size.toUpperCase()}
            </Badge>
          ))}
          {sizes.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{sizes.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex gap-2">
          <ProductSheet id={product._id}>
            <Button variant="outline" size="icon" className="text-primary" title="Edit">
              <Pencil size={18} />
            </Button>
          </ProductSheet>
          <ConfirmProductDialog id={product._id} product={product}>
            <Button variant="outline" size="icon" className="text-destructive" title="Delete">
              <Trash2 size={18} />
            </Button>
          </ConfirmProductDialog>
        </div>
      );
    },
  },
];
