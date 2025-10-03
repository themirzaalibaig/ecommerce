import { useAppSelector } from '@/store';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  // If user is authenticated, redirect to appropriate page
  if (isAuthenticated && user) {
    const redirectPath = user.role === 'admin' ? '/admin' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
