import { SummaryCardUI } from "./interface";

interface SummaryCardProps {
  rad: string;
  date: string;
  name: string;
  destination: string;
  value: number;
  toDo: string;
  path: string;
  isPinned?: boolean;
  hasMessage?: boolean;
  onPinChange?: () => void;
  onCardClick?: () => void;
  errorLoadingPins?: boolean;
  canUnpin?: boolean;
}

const SummaryCard = (props: SummaryCardProps) => {
  const {
    rad,
    date,
    name,
    destination,
    value,
    toDo,
    path,
    isPinned = false,
    hasMessage,
    onPinChange,
    onCardClick,
    errorLoadingPins,
    canUnpin,
  } = props;

  return (
    <SummaryCardUI
      rad={rad}
      date={date}
      name={name}
      destination={destination}
      value={value}
      toDo={toDo}
      path={path}
      isPinned={isPinned}
      hasMessage={hasMessage}
      onPinChange={onPinChange}
      onCardClick={onCardClick}
      errorLoadingPins={errorLoadingPins}
      canUnpin={canUnpin}
    />
  );
};

export { SummaryCard };
export type { SummaryCardProps };
