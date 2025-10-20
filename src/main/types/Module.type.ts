export enum ModuleInitStatus {
  READY = 'ready',
  SKIPPED = 'skipped',
  INITIALIZED = 'initialized',
}

export interface Module {
  name: string;
  description: string;
  initStatus: ModuleInitStatus;
}
