import { ErrorPage } from "@components/layout/ErrorPage";
import clientNotFound from "@assets/images/Expired.png";
import { useEnum } from "@hooks/useEnum";

import { errorNotClientLabels } from "./config";

function ErrorNotClient() {
  const { lang } = useEnum();

  return (
    <ErrorPage
      image={clientNotFound}
      imageAlt={errorNotClientLabels.imageAlt.i18n[lang]}
      heading={errorNotClientLabels.heading.i18n[lang]}
      description={errorNotClientLabels.description.i18n[lang]}
    />
  );
}

export { ErrorNotClient };
