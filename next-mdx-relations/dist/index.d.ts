import { Page, MDXPage, Params, RelationsConfig } from './types';
export declare function createUtils(config: RelationsConfig): {
    getPaths: (pathToContent?: string | undefined) => Promise<Params[]>;
    getPathsByProp: (prop: string) => Promise<string[]>;
    getPages: ({ meta, frontmatter }?: Record<string, any>) => Promise<Page[]>;
    getPageProps: (slug: string | string[]) => Promise<MDXPage | null>;
};
