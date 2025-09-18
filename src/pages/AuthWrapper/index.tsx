import { ReactNode } from "react";
import { IAuthProvider } from "@inube/iauth-react";

import { environment } from "@config/environment";
import { decrypt } from "@utils/encrypt/encrypt";
import { ErrorPage } from "@components/layout/ErrorPage";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { usePortalLogic } from "@hooks/usePortalRedirect";
import { useAuthHandler } from "@hooks/useAuthHandler";

interface AuthProviderWrapperProps {
  children: ReactNode;
}

function AuthContent({ children }: { children: ReactNode }) {
  const { codeError, authConfig, loading, hasAuthError } = usePortalLogic();

  useAuthHandler(authConfig, hasAuthError);

  if (loading) {
    return <LoadingAppUI />;
  }

  if (codeError || !authConfig) {
    return <ErrorPage errorCode={codeError ?? 1000} />;
  }

  return <>{children}</>;
}

export function AuthProviderWrapper({ children }: AuthProviderWrapperProps) {
  const { codeError, authConfig, loading } = usePortalLogic();

  if (loading) {
    return <LoadingAppUI />;
  }

  if (codeError && !authConfig) {
    return <ErrorPage errorCode={codeError ?? 1000} />;
  }
  if (authConfig) {
    return (
      <IAuthProvider
        originatorId={environment.ORIGINATOR_ID}
        callbackUrl={environment.REDIRECT_URI}
        iAuthUrl={environment.IAUTH_URL}
        clientId={decrypt(authConfig.clientId)}
        clientSecret={decrypt(authConfig.clientSecret)}
      >
        <AuthContent>{children}</AuthContent>
      </IAuthProvider>
    );
  }

  return <ErrorPage errorCode={1000} />;
}
