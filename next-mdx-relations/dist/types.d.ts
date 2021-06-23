import { Pluggable, Compiler } from 'unified';
export declare type PathValue = {
    objectPath: string[];
    value: string[];
};
export declare type File = {
    filePath: string;
    params: {
        slug: string[];
    };
};
export declare type Page = {
    filePath: string;
    params: {
        slug: string[];
    };
    content: string;
    frontmatter?: undefined | Record<string, any>;
    meta?: undefined | Record<string, any>;
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
