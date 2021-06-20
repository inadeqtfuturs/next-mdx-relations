import { Pluggable, Compiler } from 'unified';

export type PathValue = {
  objectPath: string[];
  value: string[];
};

export type File = {
  filePath: string;
  params: {
    slug: string[];
  };
};

export type Page = {
  filePath: string;
  params: {
    slug: string[];
  };
  content: string;
  frontmatter?: undefined | Record<string, any>;
  meta?: undefined | Record<string, any>;
};

export type Sort = {
  by: string;
  order: 'asc' | 'desc';
};

export type MetaGenerator = (page: Page) => typeof page;
export type RelationalGenerator = (pages: Page[]) => typeof pages;

export type MDXOptions = {
  remarkPlugins?: Pluggable[];
  rehypePlugins?: Pluggable[];
  hastPlugins?: Pluggable[];
  compilers?: Compiler[];
  filepath?: string;
};

export type RelationsConfig = {
  content: string;
  slugRewrites?: Record<string, string>;
  sort?: Sort;
  metaGenerators?: Record<string, MetaGenerator>;
  relationGenerators?: Record<string, RelationalGenerator>;
  mdxOptions?: MDXOptions;
};
