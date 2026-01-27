import { useLogin } from "@hooks/useLogin";

import { useEnum } from "@hooks/useEnum";

import { LoginUI } from "./interface";

function Login() {
  useLogin();
  const { lang } = useEnum();

  return <LoginUI lang={lang} />;
}

export { Login };
