import { useAppSelector } from '@/store';
import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  redirect?: string;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, token } = useAppSelector((state) => state.auth);
  if (!token) {
    return <Navigate to={'/login'} />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to={'/unauthorized'} />;
  }
  return <>{children}</>;
};
