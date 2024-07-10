import { getJestProjectsAsync } from '@nx/jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.base.json';

export default async () => ({
  projects: await getJestProjectsAsync(),
  pathsToModuleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
});
