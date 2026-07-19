import {
  defaultSchedulingConfiguration,
  type SchedulingConfiguration,
} from "../scheduling-configuration";

export function createSchedulingConfiguration(
  overrides: Partial<SchedulingConfiguration> = {},
): SchedulingConfiguration {
  return {
    ...defaultSchedulingConfiguration,
    ...overrides,
  };
}
