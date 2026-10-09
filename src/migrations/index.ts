import * as migration_20261008_065810_initial from './20261008_065810_initial';

export const migrations = [
  {
    up: migration_20261008_065810_initial.up,
    down: migration_20261008_065810_initial.down,
    name: '20261008_065810_initial'
  },
];
