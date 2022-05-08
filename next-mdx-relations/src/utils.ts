import path from 'path';
import glob from 'fast-glob';

import { File, PathValue, RelationsConfig } from './types';

// a basic isEmpty function
export function isEmpty(o: Object) {
  return Object.keys(o).length === 0 && o.constructor === Object;
}

export function getValueFromPath(
  o: Record<string, any>,
  p: string[] | string
): any {
  let usePath = p;
  if (typeof p === 'string' || p instanceof String) {
    usePath = p.split('.');
  }

  if (!Array.isArray(usePath)) {
    throw new Error('Please provide a path to `getValueFromPath`');
  }

  return usePath.reduce(
    <T extends Record<string, any>, K extends keyof T>(xs: T, x: K) =>
      xs && xs[x] ? xs[x] : null,
    o
  );
}

/**
 * @description recursive function takes an object and returns object with path and value
 * @returns PathValue[]
 */
export function getPathValues(
  o: string[] | Object = {},
  p: string[] = []
): Object | PathValue[] {
  return Array.isArray(o) || Object(o) !== o
    ? { objectPath: p, value: o }
    : Object.entries(o).flatMap(([k, v]) => getPathValues(v, [...p, k]));
}

export function getSimplifiedSlug(s: string): string {
  return s
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[-\s]+/g, '-');
}

export async function getFiles(
  config: RelationsConfig,
  pathToFiles?: string
): Promise<File[]> {
  const usePath = pathToFiles || config.content;
  const slugRewrites = config?.slugRewrites || null;
  const pathToContent = path.join(process.cwd(), usePath);
  const files = await glob.sync(`${pathToContent}/**/*.(md|mdx)`, {
    ignore: ['**/node_modules/**']
  });
  if (!files) return [];

  return files.map(filePath => {
    const slug = filePath
      .replace(new RegExp(`${path.extname(filePath)}$`), '')
      .replace(`${pathToContent}/`, '')
      .split('/');
    if (slugRewrites && slugRewrites[slug[0]]) {
      slug[0] = slugRewrites[slug[0]];
    }
    return { filePath, params: { slug } };
  });
}
