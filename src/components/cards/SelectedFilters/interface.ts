import { useEffect, useRef, useState } from "react";
import { useMediaQueries } from "@inubekit/inubekit";

export interface Filter {
  id: string;
  label: string;
  type: "status" | "assignment";
  value: string;
  count: number;
}

export interface SelectedFiltersProps {
  filters: Filter[];
  onRemove?: (filterId: string) => void;
}

export function useSelectedFilters(
  filters: Filter[],
  onRemove?: (filterId: string) => void
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(filters.length);
  const [showHiddenFilters, setShowHiddenFilters] = useState(false);

  const mediaQueries = ["(max-width: 460px)"];
  const matches = useMediaQueries(mediaQueries);
  const isMobile = matches["(max-width: 460px)"];

  useEffect(() => {
    const calculateVisibleTags = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      let usedWidth = 0;
      let count = 0;

      const dummy = document.createElement("span");
      dummy.style.visibility = "hidden";
      dummy.style.position = "absolute";
      dummy.style.whiteSpace = "nowrap";
      dummy.style.fontWeight = "bold";
      dummy.style.fontSize = "14px";
      document.body.appendChild(dummy);

      for (const filter of filters) {
        dummy.innerText = `${filter.label} (${filter.count})`;
        const tagWidth = dummy.offsetWidth + 60;
        if (usedWidth + tagWidth < containerWidth - 50) {
          usedWidth += tagWidth;
          count++;
        } else {
          break;
        }
      }

      document.body.removeChild(dummy);
      setVisibleCount(count);
    };

    const observer = new ResizeObserver(() => {
      calculateVisibleTags();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    calculateVisibleTags();

    return () => {
      observer.disconnect();
    };
  }, [filters]);

  const visibleFilters = filters.slice(0, visibleCount);
  const hiddenFilters = filters.slice(visibleCount);

  const handleRemoveFilter = (filterId: string) => {
    if (onRemove) onRemove(filterId);
  };

  return {
    containerRef,
    visibleFilters,
    hiddenFilters,
    isMobile,
    showHiddenFilters,
    setShowHiddenFilters,
    handleRemoveFilter,
  };
}
