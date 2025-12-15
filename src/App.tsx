import { useContext } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,      
  useLocation,
} from "react-router-dom";

import { FlagProvider } from "@inubekit/inubekit";
import { AppContext, AppContextProvider } from "@context/AppContext";
import { ErrorPage } from "@components/layout/ErrorPage";
import { AppPage } from "@components/layout/AppPage";
import { GlobalStyles } from "@styles/global";
import { Login } from "@pages/login";
import { initializeDataDB } from "@mocks/utils/initializeDataDB";
import { LoginRoutes } from "@routes/login";
import { BoardRoutes } from "@routes/board";
import { useIAuth } from "@inube/iauth-react";
import { environment } from "@config/environment";
import { EnumProvider } from "@context/enumContext";
import { AuthProvider } from "@pages/AuthProvider";

function LogOut() {
  localStorage.clear();
  sessionStorage.clear();
  const { logout } = useIAuth();
  logout({ logoutParams: { returnTo: environment.VITE_LOGOUT_REDIRECT_URI } });
  return <AppPage />;
}

function FirstPage() {
  const { businessUnitSigla, eventData } = useContext(AppContext);
  const location = useLocation();

  if (businessUnitSigla.length > 0) {
    return <BoardRoutes />;
  }

  initializeDataDB(businessUnitSigla);

  if (businessUnitSigla.length > 0) {
    if (location.pathname.startsWith("/login")) {
      const params = new URLSearchParams(location.search);
      const returnTo = params.get("returnTo");
      const target = returnTo ? decodeURIComponent(returnTo) : "/";
      return <Navigate to={target} replace />;
    }

    return <BoardRoutes />;
  }

  const isLoginPath = location.pathname === "/" || location.pathname.startsWith("/login");

  if (!isLoginPath) {
    const currentPath = encodeURIComponent(location.pathname + location.search);
    const userId = eventData?.user?.userAccount || "user";

    return <Navigate to={`/login/${userId}/clients?returnTo=${currentPath}`} replace />;
  }

  if (location.pathname === "/") {
     return <Login />;
  }

  return null; 
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
