import { Page, RelationsConfig } from './types';
export declare function getPaths(config: RelationsConfig, pathToContent?: string): Promise<{
    params: {
        slug: string[];
    };
}[]>;
export declare function getPages(config: RelationsConfig, { meta, frontmatter }?: Partial<Page>): Promise<Page[]>;
export declare function getPageProps(config: RelationsConfig, slug: string | string[]): Promise<{
    mdx: import("node_modules/next-mdx-remote/dist/types").MDXRemoteSerializeResult<Record<string, unknown>>;
    filePath: string;
    params: {
        slug: string[];
    };
    content: string;
    frontmatter?: Record<string, any> | undefined;
    meta?: Record<string, any> | undefined;
} | null>;
export declare function getPathsByProp(config: RelationsConfig, prop: string): Promise<string[]>;
declare function createUtils(config: RelationsConfig): {
    getPaths: (pathToContent?: string | undefined) => Promise<{
        params: {
            slug: string[];
        };
    }[]>;
    getPathsByProp: (prop: string) => Promise<string[]>;
    getPages: ({ meta, frontmatter }?: Record<string, any>) => Promise<Page[]>;
    getPageProps: (slug: string | string[]) => Promise<{
        mdx: import("node_modules/next-mdx-remote/dist/types").MDXRemoteSerializeResult<Record<string, unknown>>;
        filePath: string;
        params: {
            slug: string[];
        };
        content: string;
        frontmatter?: Record<string, any> | undefined;
        meta?: Record<string, any> | undefined;
    } | null>;
};
export default createUtils;
