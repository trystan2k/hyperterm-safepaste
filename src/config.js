// @flow

export type Config = {
  overrideFilter?: (string) => string,
  keepDollarPrefixes?: bool,
  keepNewlinePostfix?: bool,
}

export function fromObject(obj: Object): Config {
  return (obj && obj.safePaste) || {};
}
