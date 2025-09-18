import { useEffect } from "react";
import { useIAuth } from "@inube/iauth-react";

interface AuthConfig {
  clientId: string;
  clientSecret: string;
}

const useAuthHandler = (
  authConfig: AuthConfig | null,
  hasAuthError: boolean
) => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useIAuth();

  useEffect(() => {
    if (!hasAuthError && authConfig && !isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [authConfig, hasAuthError, isAuthenticated, isLoading, loginWithRedirect]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect:
      !hasAuthError && authConfig && !isAuthenticated && !isLoading,
  };
};

export { useAuthHandler };
