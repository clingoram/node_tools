// jest.config.js 或 jest.config.cjs
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
//   extensionsToTreatAsEsm: ['.js', '.jsx', '.ts', '.tsx', '.mjs']
};
export default config;