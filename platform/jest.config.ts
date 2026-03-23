import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      tsconfig: {
        module: "CommonJS",
        moduleResolution: "node",
        esModuleInterop: true,
        paths: { "@/*": ["./*"] },
      },
    }],
  },
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "app/api/**/*.ts",
    "lib/**/*.ts",
    "!lib/email.ts",
    "!lib/auth-options.ts",
    "!lib/seed-data.ts",
    "!lib/branch-colors.ts",
    "!lib/skill-paths.ts",
  ],
  coverageThreshold: {
    global: { lines: 80 },
  },
};

export default config;
