// @flow

import type {Config} from './config';

export default function filterPasteData(config: Config, data: string): string {
  if (config.overrideFilter) {
    return config.overrideFilter(data);
  }
  return filters.reduce((acc, f) => f(config, acc), data);
}

const filters = [
  (config: Config, data: string) =>
    config.keepDollarPrefixes ? data : data.replace(/^\s*\$\s+/gm, ''),
  (config: Config, data: string) =>
    config.keepNewlinePostfix ? data : data.replace(/\n*$/, ''),
];
