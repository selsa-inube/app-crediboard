import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useEnum } from "@hooks/useEnum";

import { LoadingAppUI } from "./interface";

function LoadingApp() {
  const navigate = useNavigate();
  const { lang } = useEnum();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <LoadingAppUI lang={lang} />;
}

export { LoadingApp };
