import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/custom/DataTable';
import { productColumns } from './columns';
import { ProductSheet } from '@/components/sheet/ProductSheet';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import type { Product } from '@/types/models';

export const Products = () => {
  const { data, isLoading } = useApi<{ products: Product[] }>(ENDPOINT_URLS.PRODUCTS.LIST);

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your product inventory">
        <ProductSheet>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </ProductSheet>
      </PageHeader>

      <DataTable columns={productColumns} data={data?.products || []} loading={isLoading} />
    </div>
  );
};
