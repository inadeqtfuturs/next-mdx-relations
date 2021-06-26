import { Pluggable, Compiler } from 'unified';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type PathValue = {
  objectPath: string[];
  value: string[];
};

export type Params = {
  params: {
    slug: string[];
  };
};

export type File = Params & { filePath: string };

export type Metadata = {
  [key: string]: any;
};

export type Page = File & {
  content: string;
  frontmatter?: any;
  meta?: any;
};

export type MDXPage = Page & { mdx: MDXRemoteSerializeResult };

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
