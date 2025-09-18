import { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FlagProvider } from "@inubekit/inubekit";

import { AppContext, AppContextProvider } from "@context/AppContext";
import { usePortalLogic } from "@hooks/usePortalRedirect";
import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { GlobalStyles } from "@styles/global";
import { Login } from "@pages/login";
import { initializeDataDB } from "@mocks/utils/initializeDataDB";
import { LoginRoutes } from "@routes/login";
import { BoardRoutes } from "@routes/board";
import { LoadingAppUI } from "@pages/login/outlets/LoadingApp/interface";
import { useIAuth } from "@context/AuthContext/useAuthContext";
import { IUsers } from "@context/AppContext/types";
import { EnumProvider } from "@context/enumContext";
import { usePostUserAccountsData } from "@hooks/usePostUserAccountsData";

function LogOut() {
  localStorage.clear();
  sessionStorage.clear();
  const { logout } = useIAuth();
  logout();
  return <AppPage />;
}

function FirstPage() {
  const { businessUnitSigla } = useContext(AppContext);
  initializeDataDB(businessUnitSigla);
  return businessUnitSigla.length === 0 ? <Login /> : <BoardRoutes />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="*"
        element={<FirstPage />}
        errorElement={<ErrorPage errorCode={400} />}
      />
      <Route path="login/*" element={<LoginRoutes />} />
      <Route path="/*" element={<BoardRoutes />} />
      <Route path="logout" element={<LogOut />} />
    </>
  )
);

function App() {
  const { codeError, loading, businessManager } = usePortalLogic();
  const { setUser } = useIAuth();

  const { data: userAccountsData } = usePostUserAccountsData(
    businessManager.clientId,
    businessManager.clientSecret
  );
  useEffect(() => {
    if (userAccountsData?.idToken) {
      const decoded = jwtDecode<{
        identificationNumber: string;
        names: string;
        surNames: string;
        userAccount: string;
        consumerApplicationCode: string;
      }>(userAccountsData.idToken);

      const mappedUser: IUsers = {
        id: decoded.identificationNumber,
        username: `${decoded.names} ${decoded.surNames}`,
        nickname: decoded.userAccount,
        company: decoded.consumerApplicationCode,
        urlImgPerfil: "",
      };

      setUser(mappedUser);
    }
  }, [userAccountsData, setUser]);
  if (loading) {
    return <LoadingAppUI />;
  }

  if (codeError) {
    return <ErrorPage errorCode={codeError} />;
  }

  return (
    <EnumProvider>
      <AppContextProvider>
        <FlagProvider>
          <GlobalStyles />
          <RouterProvider router={router} />
        </FlagProvider>
      </AppContextProvider>
    </EnumProvider>
  );
}

export default App;
