import { inube } from "@inubekit/inubekit";
import { feselsa } from "@tokens/feselsa";

type ITheme = typeof inube & Omit<typeof feselsa, keyof typeof inube>;

export type { ITheme };
