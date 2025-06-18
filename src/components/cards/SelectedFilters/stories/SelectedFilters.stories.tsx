import { Meta, StoryFn } from "@storybook/react";
import { useState } from "react";

import { SelectedFilters } from "..";

const story: Meta<typeof SelectedFilters> = {
  component: SelectedFilters,
  title: "components/cards/SelectedFilters",
};

const Template: StoryFn<typeof SelectedFilters> = (args) => {
  const [filters, setFilters] = useState(args.filters);

  const handleRemove = (filterLabelToRemove: string) => {
    setFilters(
      filters.filter((filter) => filter.label !== filterLabelToRemove)
    );
  };

  return <SelectedFilters filters={filters} onRemove={handleRemove} />;
};

export const Default = Template.bind({});
Default.args = {
  filters: [
    {
      id: "1",
      label: "Incapacidad",
      value: "Incapacidad",
      count: 2,
      type: "status",
    },
    {
      id: "2",
      label: "Vacaciones",
      value: "Vacaciones",
      count: 1,
      type: "assignment",
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  filters: [],
};

export default story;
