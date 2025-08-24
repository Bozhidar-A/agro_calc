import { useSelector } from 'react-redux';
import { AuthState } from '@/lib/interfaces';
import { RootState } from '@/store/store';

export function useAuth() {
  const authObj: AuthState = useSelector((state: RootState) => state.auth);

  const isAuthenticated = !!authObj?.isAuthenticated && !!authObj?.user;
  const user = isAuthenticated ? authObj.user : null;
  const userId = user?.id ?? '';
  const email = user?.email ?? '';
  const shouldShowLoginToast = authObj.showLoginToast ?? false;

  return { isAuthenticated, user, userId, email, shouldShowLoginToast, rawObj: authObj };
}
