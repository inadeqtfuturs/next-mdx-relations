import { promises as fs } from 'fs';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

import {
  getFiles,
  getPathValues,
  getSimplifiedSlug,
  getValueFromPath,
  isEmpty
} from './utils';

import {
  File,
  MetaGenerator,
  Page,
  MDXPage,
  Params,
  RelationalGenerator,
  RelationsConfig,
  Sort
} from './types';

export async function getPaths(
  config: RelationsConfig,
  pathToContent?: string
): Promise<Params[]> {
  const usePath = pathToContent || config.content;
  const files = await getFiles(config, usePath);

  const paths = files.map(({ params }) => ({ params }));
  return paths;
}

async function generatePage(file: File): Promise<Page> {
  const mdxSource = await fs.readFile(file.filePath);
  const { content, data: frontmatter } = matter(mdxSource);

  return {
    ...file,
    content,
    frontmatter
  };
}

async function generateMeta(
  page: Page,
  metaGenerators: Record<string, MetaGenerator> | null = null
): Promise<{} | undefined> {
  if (!metaGenerators) return;
  return Object.entries(metaGenerators).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: v(page)
    }),
    {}
  );
}

async function generateRelations(
  pages: Page[],
  relationGenerators: Record<string, RelationalGenerator> | null = null
): Promise<Page[]> {
  if (!relationGenerators) return pages;
  return Object.values(relationGenerators).reduce(
    (acc, generator) => generator(acc),
    pages
  );
}

function sortPages(pages: Page[], sort: Sort | undefined): Page[] {
  if (!sort) return pages;
  const { by, order } = sort;

  const sortedPages = pages.sort((a, b) => {
    const bValue = getValueFromPath(b, by);
    const aValue = getValueFromPath(a, by);
    return bValue - aValue;
  });
  if (order === 'asc') {
    return sortedPages.reverse();
  }
  return sortedPages;
}

function filterPages(
  pages: Page[],
  { meta, frontmatter }: Partial<Page>
): Page[] {
  const pathValues = getPathValues({ meta, frontmatter });
  if (!Array.isArray(pathValues)) return pages;

  const filteredPages = pages.filter(page =>
    pathValues.reduce((bool: Boolean, { objectPath, value }) => {
      const pageValue = getValueFromPath(page, objectPath);
      // if pageValue contains ALL value
      if (Array.isArray(pageValue) && Array.isArray(value)) {
        return value.every(v => pageValue.includes(v)) && bool;
      }
      // if pageValue contains value
      if (Array.isArray(pageValue) && typeof value === 'string') {
        return pageValue.includes(value) && bool;
      }
      // if value contains pageValue
      if (typeof pageValue === 'string' && Array.isArray(value)) {
        return value.includes(pageValue) && bool;
      }
      // bool
      if (typeof value === 'boolean') {
        return value === pageValue && bool;
      }
      // if pageValue === value
      return pageValue === value && bool;
    }, true)
  );

  return filteredPages;
}

export async function getPages(
  config: RelationsConfig,
  { meta = {}, frontmatter = {} }: Partial<Page> = {}
): Promise<Page[]> {
  const files = await getFiles(config);
  if (!files.length) return [];

  const { metaGenerators, relationGenerators, sort } = config;

  const pages = await Promise.all(
    files.map(async file => {
      const page = await generatePage(file);
      const pageMeta = await generateMeta(page, metaGenerators);
      return pageMeta ? { ...page, meta: pageMeta } : page;
    })
  ).then(async response => {
    const relatedPages = await generateRelations(response, relationGenerators);
    const sortedPages = sortPages(relatedPages, sort);

    if (!isEmpty(meta) || !isEmpty(frontmatter)) {
      const filteredPages = filterPages(sortedPages, { meta, frontmatter });
      return filteredPages;
    }
    return sortedPages;
  });

  return pages;
}

export async function getPageProps(
  config: RelationsConfig,
  slug: string | string[]
): Promise<MDXPage | null> {
  const pages = await getPages(config);
  const page = pages.find(
    p => JSON.stringify(p.params.slug) === JSON.stringify(slug)
  );
  if (!page) return null;
  const { frontmatter, content } = page;
  const { mdxOptions } = config;
  const mdx = await serialize(content, {
    scope: frontmatter,
    mdxOptions: { ...mdxOptions }
  });

  return {
    ...page,
    mdx
  };
}

// return a set of paths for a given tag/meta item
// todo: clean up
// add argument for setting params
export async function getPathsByProp(
  config: RelationsConfig,
  prop: string
): Promise<string[]> {
  const pages = await getPages(config, {});
  const paths = pages.reduce((acc: string[], curr: Page) => {
    const pageProp = getValueFromPath(curr, prop);
    if (!pageProp) return acc;
    if (Array.isArray(pageProp)) {
      const propSlugs = pageProp.map(p => getSimplifiedSlug(p));
      return [...acc, ...propSlugs];
    }
    const propSlug = getSimplifiedSlug(pageProp);
    return [...acc, propSlug];
  }, []);

  return [...new Set(paths)];
}

export function createUtils(config: RelationsConfig) {
  return {
    getPaths: (pathToContent?: string) => getPaths(config, pathToContent),
    getPathsByProp: (prop: string) => getPathsByProp(config, prop),
    getPages: ({ meta, frontmatter }: Record<string, any> = {}) =>
      getPages(config, { meta, frontmatter }),
    getPageProps: (slug: string | string[]) => getPageProps(config, slug)
  };
}

export {
  File,
  MetaGenerator,
  Page,
  MDXPage,
  Params,
  RelationalGenerator,
  RelationsConfig,
  Sort
};
