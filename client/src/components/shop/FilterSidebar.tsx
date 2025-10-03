import { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Label,
  Separator,
  Slider,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { useApi } from '@/hooks/useApi';
import { ENDPOINT_URLS } from '@/constants/endpoints';
import type { Category } from '@/types/models';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  onFilterChange: (filters: {
    categories: string[];
    priceRange: number[];
    sizes: string[];
  }) => void;
}

export const FilterSidebar = ({
  isOpen,
  onClose,
  isMobile = false,
  onFilterChange,
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const { data: categoriesData } = useApi<{ categories: Category[] }>(
    ENDPOINT_URLS.CATEGORIES.LIST
  );

  const sizes = ['xs', 's', 'm', 'l', 'xl'];

  // Notify parent component of filter changes
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      sizes: selectedSizes,
    });
  }, [selectedCategories, priceRange, selectedSizes, onFilterChange]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleClearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
    setSelectedSizes([]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          Clear All
        </Button>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-medium">Categories</h3>
        <div className="space-y-2">
          {categoriesData?.categories?.map((category) => (
            <div key={category._id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category._id}`}
                checked={selectedCategories.includes(category._id)}
                onCheckedChange={() => handleCategoryChange(category._id)}
              />
              <Label htmlFor={`category-${category._id}`} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-medium">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            step={10}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">${priceRange[0]}</span>
            <span className="text-muted-foreground">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div className="space-y-3">
        <h3 className="font-medium">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSizeChange(size)}
              className="w-12"
            >
              {size.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Apply Button (Mobile Only) */}
      {isMobile && (
        <Button className="w-full" onClick={onClose}>
          Apply Filters
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-6">
        <FilterContent />
      </div>
    </aside>
  );
};
