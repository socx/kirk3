export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src/tests"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  // projects: [
  //   {
  //     testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  //     preset: "ts-jest",
  //     displayName: "my-package",
  //     testMatch: ["<rootDir>/packages/my-package/__tests__/**/*.spec.ts"],
  //   }
  // ],
};
