import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Store } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { ADMIN_SIDEBAR_NAV } from '@/constants/sidebar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui';

export const AdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          {state === 'expanded' && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold">Admin Panel</span>
              <span className="text-xs text-muted-foreground">E-Commerce</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {ADMIN_SIDEBAR_NAV.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={item.title}
                      disabled={item.disabled}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-4">
          {state === 'expanded' ? (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium">Need Help?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check our documentation or contact support
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-xs text-muted-foreground">?</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
