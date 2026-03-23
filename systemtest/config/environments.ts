// Defines the built-in environment defaults used when env vars are not provided.
import type { TestEnvironment } from './test-env';

type EnvironmentDefaults = {
  uiBaseUrl: string;
  credentials: {
    username: string;
    password: string;
  };
};

const DEFAULTS: Record<TestEnvironment, EnvironmentDefaults> = {
  dev: {
    uiBaseUrl: 'http://127.0.0.1:5173',
    credentials: {
      username: '92718463',
      password: 'Harbour!92'
    }
  },
  staging: {
    uiBaseUrl: 'https://staging-ui.example.internal',
    credentials: {
      username: '',
      password: ''
    }
  },
  prod: {
    uiBaseUrl: 'https://ui.example.internal',
    credentials: {
      username: '',
      password: ''
    }
  }
};

export function getEnvironmentDefaults(
  testEnv: TestEnvironment
): EnvironmentDefaults {
  return DEFAULTS[testEnv];
}
