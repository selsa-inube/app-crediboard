import { useMemo } from "react";

import { IDataInformationItem } from "./interface";
import { ROWS_PER_PAGE } from "./config";

export const usePagination = (dataInformation: IDataInformationItem[], setCurrentPage: React.Dispatch<React.SetStateAction<number>>, currentPage: number) => {
  const totalRecords = dataInformation.length;

  if(totalRecords <= ROWS_PER_PAGE){
    setCurrentPage(0)
  }
  
  let paginatedData: IDataInformationItem[] = [];

  const totalPages = useMemo(() => {
    return Math.ceil(totalRecords / ROWS_PER_PAGE) || 1;
  }, [totalRecords, ROWS_PER_PAGE]);
  
  const handleStartPage = () => setCurrentPage(0);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const handleEndPage = () => setCurrentPage(totalPages - 1);

  const startIndex = currentPage * ROWS_PER_PAGE; 
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalRecords);

  paginatedData = dataInformation.slice(startIndex, endIndex);

  return {
    setCurrentPage,
    currentPage,
    paginatedData,
    totalPages,
    handleStartPage,
    handlePrevPage,
    handleNextPage,
    handleEndPage,
    startIndex,
    endIndex
  };
};
