import { RuleBuilder } from "./types";

export const ruleConfig: Record<string, RuleBuilder> = {
  PositionsAuthorizedToRemoveAnchorsPlacedByOther: (data) => {
    const hasData = data && Object.keys(data).length > 0;

    const conditions = hasData
      ? Object.entries(data).map(([key, value]) => ({
          condition: key,
          value,
        }))
      : [];

    return {
      ruleName: "PositionsAuthorizedToRemoveAnchorsPlacedByOther",
      conditions,
    };
  },
};
