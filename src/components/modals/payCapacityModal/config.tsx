export const dataTabs = [
  { id: "ordinary", label: "Cuotas ordinarias" },
  { id: "extraordinary", label: "Cuotas extraordinarias" },
];

export const headers = [
  { label: "Concepto", key: "concept", mobile: true},
  { label: "Valor", key: "value", mobile: false },
  { label: "Fecha", key: "date", mobile: false },
  { label: "Detalles", key: "details", mobile: true },
];

export const paymentCapacityData = {
  incomeSources: "(+) Total fuentes de ingreso reportadas",
  subsistenceReserve: "(-) Reserva mínima de subsistencia",
  newPromises: "(=) Neto disponible para nuevos compromisos",
  lineOfCredit: "(*) Plazo máx. en *Nombre línea de crédito*",
  getLineOfCredit: (nombreLinea: string) => `(x) Plazo máx. en ${nombreLinea}`,
  maxValue: (
    <>
      Monto máximo calculado para una cuota de <strong>2.000.000</strong> y
      plazo de <strong>20</strong> meses.
    </>
  ),
  maxValueDescription: "Monto máximo con cuotas ordinarias",
  maxValueAmount: "Monto máximo calculado para un plazo de 24 meses.",
  maxAmountOridinary: "Monto máximo con cuotas ordinarias",
  maxAmountExtraordinary:
    "Monto máximo sumando cuotas ordinarias y extraordinarias.",
  maxTotal: "Monto máximo total",
  noExtraordinaryInstallmentsAvailable: "No hay cuotas extraordinarias disponibles",
  errorLoadingData: "Error al cargar datos",
  errorNoData:
    "No se pudo obtener la información de capacidad de pago. Por favor, intenta nuevamente.",
  months: " meses"
};


export const getMaxValueText = (maxAmount: number, maxTerm: number) => (
  <>
    Monto máximo calculado para una cuota de
    <strong>{maxAmount.toLocaleString("es-CO")}</strong> y plazo de
    <strong>{maxTerm}</strong> meses.
  </>
);

export const detailsExtraordinaryInstallments = {
  title: "Detalles",
  close: "Cerrar",
  value: "Valor",
  date: "Fecha"
}