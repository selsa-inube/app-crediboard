import { useMemo } from "react";

import { TableBoard } from "@components/data/TableBoard";
import { Accordion, type IAccordionProps } from "@components/data/Accordion";
import {
  getEntriesCommercialManagement,
  getTitlesCommercialManagement,
} from "@config/pages/board/outlet/financialReporting/configCommercialManagement";
import { useEnum } from "@hooks/useEnum";

interface IDataCommercialManagement {
  dataAccordeon: IAccordionProps[];
  dataRef: React.RefObject<HTMLDivElement>;
  isOpen?: boolean;
}

export const DataCommercialManagement = (props: IDataCommercialManagement) => {
  const { dataAccordeon, dataRef, isOpen = false } = props;
  const { lang } = useEnum();

   const titles = useMemo(
    () => getTitlesCommercialManagement(lang),
    [lang]
  );
  
  const entries = useMemo(
    () => getEntriesCommercialManagement(lang),
    [lang]
  );
  return (
    <div ref={dataRef}>
      <TableBoard
        id="commercialManagement"
        titles={titles}
        entries={entries}
        appearanceTable={{ title: "dark", borderTable: true, widthTd: "180px" }}
      />
      {dataAccordeon.map((accordeon) => (
        <Accordion
          key={accordeon.name}
          name={accordeon.name}
          title={accordeon.title}
          content={accordeon.content}
          isOpen={isOpen}
        />
      ))}
    </div>
  );
};
