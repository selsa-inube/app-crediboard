import { Stack } from "@inube/design-system";

import { Fieldset } from "@src/components/data/Fieldset";
import { TableBoard } from "@src/components/data/TableBoard";
import {
  actionsFinanacialReporting,
  entriesFinanacialReporting,
  titlesFinanacialReporting,
} from "./config";

export const PromissoryNotes = () => {
  return (
    <Stack direction="column">
      <Fieldset title="Pagarés y Libranzas">
        <TableBoard
          id="promissoryNotes"
          titles={titlesFinanacialReporting}
          entries={entriesFinanacialReporting}
          actions={actionsFinanacialReporting}
        />
      </Fieldset>
    </Stack>
  );
};
