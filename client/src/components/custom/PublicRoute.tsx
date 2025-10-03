import { useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
  redirect?: string;
}

export const PublicRoute = ({ children, redirect }: PublicRouteProps) => {
  const isAuthenticated = useAppSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !redirect) {
      // If redirect is empty, go back
      navigate(-1);
    }
  }, [isAuthenticated, redirect, navigate]);

  if (isAuthenticated) {
    if (!redirect) {
      // Prevent rendering anything while navigating back
      return null;
    }
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
};
