import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Package,
} from 'lucide-react';
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
    title: 'Main',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        title: 'All Products',
        href: '/admin/products',
        icon: ShoppingBag,
      },
      {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
      },
      {
        title: 'Inventory',
        href: '/admin/inventory',
        icon: Package,
      },
    ],
  },
  {
    title: 'Sales',
    items: [
      {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
      },
      {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];
