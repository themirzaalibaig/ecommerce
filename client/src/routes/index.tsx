import { AdminProtectedRoute } from '@/components/custom/AdminProtectedRoute';
import { PublicRoute } from '@/components/custom/PublicRoute';
import { AdminLayout } from '@/components/layout';
import { Categories } from '@/pages/admin/categories/Categories';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Products } from '@/pages/admin/products/Products';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { NotFound } from '@/pages/NotFound';
import { Unauthorized } from '@/pages/Unauthorized';
import { Route, Routes } from 'react-router-dom';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
