import { Page, MDXPage, Params, RelationsConfig } from './types';
export declare function getPaths(config: RelationsConfig, pathToContent?: string): Promise<Params[]>;
export declare function getPages(config: RelationsConfig, { meta, frontmatter }?: Partial<Page>): Promise<Page[]>;
export declare function getPageProps(config: RelationsConfig, slug: string | string[]): Promise<MDXPage | null>;
export declare function getPathsByProp(config: RelationsConfig, prop: string): Promise<string[]>;
declare function createUtils(config: RelationsConfig): {
    getPaths: (pathToContent?: string | undefined) => Promise<Params[]>;
    getPathsByProp: (prop: string) => Promise<string[]>;
    getPages: ({ meta, frontmatter }?: Record<string, any>) => Promise<Page[]>;
    getPageProps: (slug: string | string[]) => Promise<MDXPage | null>;
};
export default createUtils;
