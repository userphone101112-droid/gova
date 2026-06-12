import { loadBackendConfig, BackendEnv } from '@gv/config';

export const env = loadBackendConfig(process.env);

export type Env = BackendEnv;
