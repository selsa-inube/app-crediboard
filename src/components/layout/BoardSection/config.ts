import { ICreditRequestTotalsByStage } from "@services/credit-request/query/getCreditRequestTotalsByStage/types";

export const configOption = {
  textNodata: "No hay solicitudes en trámite para esta etapa",
  noMatches: "No hay solicitudes que cumplan con el filtro aplicado",
  load: "Mostrar más datos",
};

export const totalsKeyBySection: Record<
  string,
  keyof ICreditRequestTotalsByStage
> = {
  "Gestión Comercial": "commercialManagement",
  "Verificación y Aprobación": "verificationAndApproval",
  "Formalización Garantías": "guaranteeFormalization",
  "Trámite Desembolso": "disbursementProcessing",
  "Cumplimiento Requisitos": "requirementsFulfillment",
};
