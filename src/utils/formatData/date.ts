const formatPrimaryDate = (date: Date, withTime?: boolean): string => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  if (withTime) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}/${month}/${year} - ${hours}:${minutes} ${ampm}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};

export { formatPrimaryDate };
