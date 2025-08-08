import { Stack, Text, Tag, Icon } from "@inubekit/inubekit";
import { MdApps, MdClose } from "react-icons/md";

import {
  StyledContainerFilters,
  MoreFiltersWrapper,
  StyledHiddenFiltersMenu,
  HiddenFilterItem,
} from "./styles";
import { useSelectedFilters, SelectedFiltersProps } from "./interface";
import { dataFilters } from "./config";

function SelectedFilters(props: SelectedFiltersProps) {
  const { filters, onRemove } = props;

  const {
    containerRef,
    visibleFilters,
    hiddenFilters,
    isMobile,
    showHiddenFilters,
    setShowHiddenFilters,
    handleRemoveFilter,
  } = useSelectedFilters(filters, onRemove);

  return (
    <StyledContainerFilters ref={containerRef}>
      {filters.length > 0 ? (
        <Stack direction="row" gap="8px">
          {visibleFilters.map((filter, index) => (
            <Tag
              key={index}
              appearance={filter.type === "status" ? "dark" : "primary"}
              label={`${filter.label}`}
              removable={onRemove !== undefined}
              onClose={() => handleRemoveFilter(filter.id)}
              displayIcon={false}
            />
          ))}
          {hiddenFilters.length > 0 && (
            <MoreFiltersWrapper
              onClick={() => setShowHiddenFilters((prev) => !prev)}
            >
              <Tag appearance="primary" label="..." removable={false} />
              {showHiddenFilters && (
                <StyledHiddenFiltersMenu $isMobile={isMobile}>
                  {hiddenFilters.map((filter, index) => (
                    <HiddenFilterItem key={index}>
                      <Stack gap="4px" alignItems="center">
                        <Icon
                          appearance="primary"
                          icon={<MdApps />}
                          size="14px"
                        />
                        <Text size="small">{`${filter.label}`}</Text>
                      </Stack>
                      <Icon
                        appearance="dark"
                        icon={<MdClose />}
                        cursorHover={true}
                        size="16px"
                        onClick={
                          onRemove
                            ? () => handleRemoveFilter(filter.id)
                            : undefined
                        }
                      />
                    </HiddenFilterItem>
                  ))}
                </StyledHiddenFiltersMenu>
              )}
            </MoreFiltersWrapper>
          )}
        </Stack>
      ) : (
        <Text type="label" size="small" appearance="gray">
          {dataFilters.withoutFilters}
        </Text>
      )}
    </StyledContainerFilters>
  );
}

export { SelectedFilters };
