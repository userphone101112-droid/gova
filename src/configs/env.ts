import { loadFrontendConfig, FrontendEnv } from '@gv/config';

export const env = loadFrontendConfig(process.env);

export type Env = FrontendEnv;
