import { useContext, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { FlagProvider } from "@inubekit/inubekit";
import { AppContext, AppContextProvider } from "@context/AppContext";
import { ErrorPage } from "@components/layout/ErrorPage";
import { GlobalStyles } from "@styles/global";
import { Login } from "@pages/login";
import { initializeDataDB } from "@mocks/utils/initializeDataDB";
import { LoginRoutes } from "@routes/login";
import { BoardRoutes } from "@routes/board";
import { useIAuth } from "@inube/iauth-react";
import { EnumProvider } from "@context/enumContext";
import { AuthProvider } from "@pages/AuthProvider";

function LogOut() {
  sessionStorage.clear();
  const { logout } = useIAuth();
  useEffect(() => {
    logout();
  }, [logout]);
  return null;
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
  return (
    <AuthProvider>
      <EnumProvider>
        <AppContextProvider>
          <FlagProvider>
            <GlobalStyles />
            <RouterProvider router={router} />
          </FlagProvider>
        </AppContextProvider>
      </EnumProvider>
    </AuthProvider>
  );
}

export default App;
