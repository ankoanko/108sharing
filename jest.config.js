module.exports = {
  roots: ['<rootDir>/frontend'],
  modulePaths: ['<rootDir>/frontend'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '\\.[j]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/!node_modules\\/lodash-es/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Setup Enzyme
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>/frontend/test/setupEnzyme.ts'],
}
