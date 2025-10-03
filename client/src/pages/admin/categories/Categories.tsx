import { DataTable } from '@/components/custom/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import { useApi } from '@/hooks/useApi';
import type { Category } from '@/types/models';
import { columns } from './columns';
import CategorySheet from '@/components/sheet/CategorySheet';

export const Categories = () => {
  const { data, isLoading } = useApi<{ categories: Category[] }>(ENDPOINT_URLS.CATEGORIES.LIST, {
    auth: true,
  });
  console.log(data);
  return (
    <div>
      <PageHeader title="Categories" description="Manage your categories">
        <CategorySheet>
          <Button>Add Category</Button>
        </CategorySheet>
      </PageHeader>
      <DataTable
        data={data?.categories || []}
        columns={columns}
        loading={isLoading}
        exportFileName="categories"
        enableGlobalSearch={true}
        enableDateFilter={true}
        dateFilterColumn="createdAt"
      />
    </div>
  );
};
