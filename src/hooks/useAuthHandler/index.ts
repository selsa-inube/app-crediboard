import { useEffect } from "react";
import { useIAuth } from "@inube/iauth-react";

import { useSignOut } from "@hooks/useSignOut";

interface AuthConfig {
  clientId: string;
  clientSecret: string;
}

const useAuthHandler = (
  authConfig: AuthConfig | null,
  hasAuthError: boolean,
  portalCode: string
) => {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useIAuth();
  const { signOut } = useSignOut();

  if (error) {
    signOut("/error?code=1009");
  }

  useEffect(() => {
    const isLogoutRoute = window.location.pathname === "/logout";
    if (
      !hasAuthError &&
      authConfig &&
      portalCode &&
      !isAuthenticated &&
      !isLoading &&
      !isLogoutRoute
    ) {
      loginWithRedirect();
    }
  }, [
    authConfig,
    hasAuthError,
    portalCode,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
  ]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect:
      !hasAuthError &&
      authConfig &&
      portalCode &&
      !isAuthenticated &&
      !isLoading,
  };
};

export { useAuthHandler };
