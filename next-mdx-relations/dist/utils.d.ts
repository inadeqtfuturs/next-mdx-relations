import { File, PathValue, RelationsConfig } from './types';
export declare function isEmpty(o: Object): boolean;
export declare function getValueFromPath(o: Record<string, any>, p: string[] | string): any;
/**
 * @description recursive function takes an object and returns object with path and value
 * @returns PathValue[]
 */
export declare function getPathValues(o?: string[] | Object, p?: string[]): Object | PathValue[];
export declare function getSimplifiedSlug(s: string): string;
export declare function getFiles(config: RelationsConfig, pathToFiles?: string): Promise<File[]>;
