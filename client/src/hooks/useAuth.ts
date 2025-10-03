import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';

export const useAuth = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handelLogout = () => {
    dispatch(logout());
  };
  return {
    handelLogout,
    token,
    user,
  };
};
