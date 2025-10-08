import { useSelector } from 'react-redux';

/**
 * A custom hook to access authentication state from the Redux store.
 * @returns {object} The authentication state including user, token, isAuthenticated, isLoading, and error.
 */
export const useAuth = () => {
  const authState = useSelector((state) => state.auth);
  return authState;
};