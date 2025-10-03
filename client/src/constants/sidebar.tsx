import { ShoppingBag, FolderTree } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export const ADMIN_SIDEBAR_NAV: SidebarNavGroup[] = [
  {
    title: 'Manage',
    items: [
      {
        title: 'Products',
        href: '/admin/products',
        icon: ShoppingBag,
      },
      {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
      },
    ],
  },
];
