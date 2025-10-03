import { AdminProtectedRoute } from '@/components/custom/AdminProtectedRoute';
import { PublicRoute } from '@/components/custom/PublicRoute';
import { Categories } from '@/pages/admin/categories/Categories';
import { Dashboard } from '@/pages/admin/Dashboard';
import { Products } from '@/pages/admin/products/Products';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
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
      <Route path="/dashboard">
        <Route
          index
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="categories"
          element={
            <AdminProtectedRoute>
              <Categories />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <AdminProtectedRoute>
              <Products />
            </AdminProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};
