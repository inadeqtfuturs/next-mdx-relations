import { Pluggable, Compiler } from 'unified';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
export declare type PathValue = {
    objectPath: string[];
    value: string[];
};
export declare type Params = {
    params: {
        slug: string[];
    };
};
export declare type File = Params & {
    filePath: string;
};
export declare type Metadata = {
    [key: string]: any;
};
export declare type Page = File & {
    content: string;
    frontmatter?: any;
    meta?: any;
};
export declare type MDXPage = Page & {
    mdx: MDXRemoteSerializeResult;
};
export declare type Sort = {
    by: string;
    order: 'asc' | 'desc';
};
export declare type MetaGenerator = (page: Page) => typeof page;
export declare type RelationalGenerator = (pages: Page[]) => typeof pages;
export declare type MDXOptions = {
    remarkPlugins?: Pluggable[];
    rehypePlugins?: Pluggable[];
    hastPlugins?: Pluggable[];
    compilers?: Compiler[];
    filepath?: string;
};
export declare type RelationsConfig = {
    content: string;
    slugRewrites?: Record<string, string>;
    sort?: Sort;
    metaGenerators?: Record<string, MetaGenerator>;
    relationGenerators?: Record<string, RelationalGenerator>;
    mdxOptions?: MDXOptions;
};
