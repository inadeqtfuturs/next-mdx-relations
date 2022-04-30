'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var matter = require('gray-matter');
var serialize = require('next-mdx-remote/serialize');
var path = require('path');
var glob = require('fast-glob');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var matter__default = /*#__PURE__*/_interopDefaultLegacy(matter);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);

// a basic isEmpty function
function isEmpty(o) {
    return Object.keys(o).length === 0 && o.constructor === Object;
}
function getValueFromPath(o, p) {
    let usePath = p;
    if (typeof p === 'string' || p instanceof String) {
        usePath = p.split('.');
    }
    if (!Array.isArray(usePath)) {
        throw new Error('Please provide a path to `getValueFromPath`');
    }
    return usePath.reduce((xs, x) => xs && xs[x] ? xs[x] : null, o);
}
function getPathValues(o = {}, p = []) {
    return Array.isArray(o) || Object(o) !== o
        ? { objectPath: p, value: o }
        : Object.entries(o).flatMap(([k, v]) => getPathValues(v, [...p, k]));
}
// this is SUPER rudimentary. replace later
function getSimplifiedSlug(s) {
    return s.replace(' ', '-');
}
async function getFiles(config, pathToFiles) {
    const usePath = pathToFiles || config.content;
    const slugRewrites = (config === null || config === void 0 ? void 0 : config.slugRewrites) || null;
    const pathToContent = path__default["default"].join(process.cwd(), usePath);
    const files = await glob__default["default"].sync(`${pathToContent}/**/*.(md|mdx)`, {
        ignore: ['**/node_modules/**']
    });
    if (!files)
        return [];
    return files.map(filePath => {
        const slug = filePath
            .replace(new RegExp(`${path__default["default"].extname(filePath)}$`), '')
            .replace(`${pathToContent}/`, '')
            .split('/');
        if (slugRewrites && slugRewrites[slug[0]]) {
            slug[0] = slugRewrites[slug[0]];
        }
        return { filePath, params: { slug } };
    });
}

async function getPaths(config, pathToContent) {
    const usePath = pathToContent || config.content;
    const files = await getFiles(config, usePath);
    // filters out the filepath and returns JUST params object
    const paths = files.map(({ params }) => ({ params }));
    return paths;
}
async function generatePage(file) {
    const mdxSource = await fs.promises.readFile(file.filePath);
    const { content, data: frontmatter } = matter__default["default"](mdxSource);
    return {
        ...file,
        content,
        frontmatter
    };
}
async function generateMeta(page, metaGenerators = null) {
    if (!metaGenerators)
        return;
    return Object.entries(metaGenerators).reduce((acc, [k, v]) => ({
        ...acc,
        [k]: v(page)
    }), {});
}
async function generateRelations(pages, relationGenerators = null) {
    if (!relationGenerators)
        return pages;
    return Object.values(relationGenerators).reduce((acc, generator) => generator(acc), pages);
}
function sortPages(pages, sort) {
    if (!sort)
        return pages;
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
function filterPages(pages, { meta, frontmatter }) {
    const pathValues = getPathValues({ meta, frontmatter });
    if (!Array.isArray(pathValues))
        return pages;
    const filteredPages = pages.filter(page => pathValues.reduce((bool, { objectPath, value }) => {
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
    }, true));
    return filteredPages;
}
async function getPages(config, { meta = {}, frontmatter = {} } = {}) {
    const files = await getFiles(config);
    if (!files.length)
        return [];
    const { metaGenerators, relationGenerators, sort } = config;
    const pages = await Promise.all(files.map(async (file) => {
        const page = await generatePage(file);
        const pageMeta = await generateMeta(page, metaGenerators);
        return pageMeta ? { ...page, meta: pageMeta } : page;
    })).then(async (response) => {
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
async function getPageProps(config, slug) {
    const pages = await getPages(config);
    const page = pages.find(p => JSON.stringify(p.params.slug) === JSON.stringify(slug));
    if (!page)
        return null;
    const { frontmatter, content } = page;
    const { mdxOptions } = config;
    const mdx = await serialize.serialize(content, {
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
async function getPathsByProp(config, prop) {
    const pages = await getPages(config, {});
    const paths = pages.reduce((acc, curr) => {
        const pageProp = getValueFromPath(curr, prop);
        if (!pageProp)
            return acc;
        if (Array.isArray(pageProp)) {
            const propSlugs = pageProp.map(p => getSimplifiedSlug(p));
            return [...acc, ...propSlugs];
        }
        const propSlug = getSimplifiedSlug(pageProp);
        return [...acc, propSlug];
    }, []);
    return [...new Set(paths)];
}
function createUtils(config) {
    return {
        getPaths: (pathToContent) => getPaths(config, pathToContent),
        getPathsByProp: (prop) => getPathsByProp(config, prop),
        getPages: ({ meta, frontmatter } = {}) => getPages(config, { meta, frontmatter }),
        getPageProps: (slug) => getPageProps(config, slug)
    };
}

exports.createUtils = createUtils;
exports.getPageProps = getPageProps;
exports.getPages = getPages;
exports.getPaths = getPaths;
exports.getPathsByProp = getPathsByProp;
