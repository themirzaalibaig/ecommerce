import { useState, useCallback, useMemo } from 'react';
import { ShopHeader, FilterSidebar, ProductCard, CartSheet } from '@/components/shop';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import type { Product } from '@/types/models';
import { Skeleton } from '@/components/ui';

export const Home = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1000],
    sizes: [] as string[],
  });

  // Build query params from filters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.categories.length > 0) {
      params.append('categories', filters.categories.join(','));
    }

    if (filters.priceRange[0] > 0) {
      params.append('minPrice', filters.priceRange[0].toString());
    }

    if (filters.priceRange[1] < 1000) {
      params.append('maxPrice', filters.priceRange[1].toString());
    }

    if (filters.sizes.length > 0) {
      params.append('sizes', filters.sizes.join(','));
    }

    return params.toString();
  }, [filters]);

  const { data, isLoading } = useApi<{ products: Product[] }>(
    `${ENDPOINT_URLS.PRODUCTS.LIST}${queryParams ? `?${queryParams}` : ''}`
  );

  const handleFilterChange = useCallback(
    (newFilters: { categories: string[]; priceRange: number[]; sizes: string[] }) => {
      setFilters(newFilters);
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col">
      <ShopHeader onMenuToggle={() => setIsMobileFilterOpen(true)} />

      <div className="container mx-auto flex-1 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <FilterSidebar
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            isMobile={false}
            onFilterChange={handleFilterChange}
          />

          {/* Mobile Sidebar */}
          <FilterSidebar
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            isMobile={true}
            onFilterChange={handleFilterChange}
          />

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">All Products</h1>
              <p className="text-muted-foreground mt-2">
                Discover our collection of premium products
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && data?.products && data.products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && (!data?.products || data.products.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg text-muted-foreground">No products found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Cart Sheet */}
      <CartSheet />
    </div>
  );
};
