import { Route, Routes } from "react-router-dom";

import { ErrorPage } from "@components/layout/ErrorPage";
import { Board } from "@pages/board";
import { BoardLayout } from "@pages/board/outlets/boardlayout";
import { CreditProfileInfo } from "@pages/board/outlets/creditProfileInfo";
import { FinancialReporting } from "@pages/board/outlets/financialReporting";

function BoardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Board />}>
        <Route path="/" element={<BoardLayout />} />
        <Route path="extended-card/:creditRequestCode" element={<FinancialReporting />} />
        <Route
          path="extended-card/:creditRequestCode/:approverid"
          element={<FinancialReporting />}
        />
        <Route
          path="extended-card/:creditRequestCode/credit-profile"
          element={<CreditProfileInfo />}
        />
      </Route>
      <Route path="/*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
}

export { BoardRoutes };
