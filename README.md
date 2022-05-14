# next-mdx-relations

i have markdown. i want to generate relations between them.

`next-mdx-relations` is a light set of utilities for generation relational data between markdown files. it is built to work with [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote), which it uses as a peer dependency. `next-mdx-relations` abstracts away much of the boilerplate you would write to spin up an md/x powered next.js site, while providing control over how your md/x is processed.

## toc

1. [getting started](#getting-started)
2. [example](#example)
3. [api](#api)
4. [typescript](#typescript)
5. [future](#future)

## getting started

1. Add package and peer dependencies

``` shell
yarn add fast-glob gray-matter next-mdx-remote next-mdx-relations
```

2. Create a `next-mdx-relations.config.js` in your project (preferably the root, but it can be anywhere)

``` js
import { createUtils } from 'next-mdx-relations';

export const {
  getPaths,
  getPages,
  getPageProps,
  getPathsByProp
} = createUtils({
  content: '/content' // path to content
})
```

3. Use any of the exported functions in `getStaticPaths` or `getStaticProps`.

## example

I'm building a blog with a collection of posts written in markdown:

``` js
// next-mdx-relations.config.js
export const {
  getPaths,
  getPages,
  getPageProps,
} = createUtils({
  content: '/content' // path to content
})
```

``` js
// /pages/blog/index.js

import React from 'react';
import Link from 'next/link';
import { getPages } from '../../next-mdx-relations.config.js';

// render a list of blog posts
export default function BlogIndex({ posts }) {
  return (
    {posts.map(({ 
      frontmatter: { title, excerpt, id },
      params: { slug }
    }) => (
      <div key={id}>
        <Link href={slug} passHref>
          <a>{title}</a>
        </Link>
        <p>{excerpt}</p>
      </div>
    ))}
  )
}

export async function getStaticProps() {
  const posts = await getPages(); // gets an array of all pages in the /content directory

  return {
    props: {
      posts
    }
  };
}
```

``` js
// /pages/blog/[...slug].js
// https://nextjs.org/docs/routing/dynamic-routes

import React from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { getPages } from '../../next-mdx-relations.config.js';

export default function Slug({ mdx, ...pageNode }) {
  const { frontmatter: { title, excerpt } } = pageNode;
  return (
    <article>
      <h1>{title}</h1>
      <p>{excerpt}</p>
      <MDXRemote {...mdx} />
    </article>
  )
}

export async function getStaticProps({ params: { slug } }) {
  const props = await getPageProps(slug); // returns pageProps and serialized mdx based on provided slug

  return {
    props
  };
}

export async function getStaticPaths() {
  const paths = await getPaths(); // returns array of paths for generating pages
  
  return {
    paths,
    fallback: false
  };
}
```

## api

`next-mdx-relations` takes a config object and returns utilities for generating static content and relationships between them. Most of the api for actually generating the pages is what you would write yourself if you were spinning up a blog or statically generated next.js site. What `next-mdx-relations` provides is a suite of utilities that process your data, overrides to filesystem-based routing, and allows you to intervene at critical points in the content generation process.

Behind the scenes, we do the following:

1. get all of the files from your content folder
2. for each file, we generate metadata based on config provided functions, and return everything you'd want to know about that file (frontmatter, filepath, params/slug, etc)
3. because we have access to all the files and metadata, we then allow for inserting custom relations between content. we can track when one file mentions another from the file being mentioned, for example
4. we sort the files based on provided sort criteria. we sort last in case you want to sort based on generated meta or relational data

At the end of this process, you have all your files sorted, and you can filter down to what you need based on the meta and relational data that have been generated.

### config

The config object can take the following parameters:

#### content: string (required)

This is the path to your content. It should be the root of your content folder -- you can handle different routes or processing different kinds of data differently by using `metaGenerators` and `relationGenerators`.

The utilities `createUtils` returns will treat the content folder as a root for file system routing. The common use case would be collecting writing in a `/blog` folder and having the utilities return slugs for `/blog/post-title`.

#### slugRewrites: object?

`slugRewrites` is an object with key values pairs that correspond to a file's path (i.e. `content/blog`) and the rewritten slug path (`/garden`). This is one way to make routing among different collections of files uniform.

#### sort: object?

``` js
sort: {
  by: 'frontmatter.date', // string path to value
  order: 'desc' // asc | desc
}

```

`sort` takes an object with two keys. `by` is a stringified path to a particular item associated with the pages (i.e. date or type). `order` takes a string of either 'asc' or 'desc' and corresponds to the sort order.

#### metaGenerators: object?

`metaGenerators` is an object consisting of key value pairs that correspond to a metadata attribute and a function used to generate that attribute. An example of this would be taking an isoDate and converting it to a string.

``` js
import { DateTime } from 'luxon';
import { createUtils } from 'next-mdx-relations';

export const {
  getPaths,
  getPages
} = createUtils({
  content: '/content',
  metaGenerators: {
    date: node => {
      const { frontmatter: { date } } = node;
      if (date) {
        const isoDate = DateTime.fromISO(date);
        return isoDate.toLocaleString(DateTime.DATE_FULL);
      }
      return null;
    }
  }
})
```

`metaGenerators` have access to the `node` or `file`. Anything in the content or frontmatter of the file is available to add additional meta. Note that these parameters are not combined with the frontmatter in the file but placed in their own `meta` object so as not to override anything static in the file itself.

#### relationGenerators: object?

`relationGenerators` is an object consisting of key value pairs that correspond to a relational attribute and the function used to generate that attribute. These functions have access to all `nodes` after they've been read and `metaGenerators` have been run. We'll use the provided key to add the returned data to each page's `meta` object.

`relation` keys can be defined either as a string or as a stringified array. In the example below, we're generating both the previous and next page/post. Rather than break these out into two different generators, we can generate both values in one function, and each value will be name spaced correctly.

``` js
import { createUtils } from 'next-mdx-relations';

export const {
  getPaths,
  getPages
} = createUtils({
  content: '/content',
  relationGenerators: {
    '[prev, next]': nodes => nodes
      // we have not sorted all our files yet, so to create
      // directional links, we'd have to do it here
      .sort((a, b) => a?.meta?.date - b?.meta?.date)
      .map((node, index, array) => {
        const prev = index > 0 ? array[index - 1] : null;
        const next = index < array.length -1 ? array[index + 1] : null;
        return { prev, next };
      }),
    index: nodes => nodes.map((_, index) => index)
    },
})
```

Additionally, we could get something simple like the index of each given node within the array of nodes.

Like `metaGenerators`, `relationGenerators` has access to the whole node, but only (re)places data set in `node.meta`. This prevents unintended mutations of static data.

#### mdxOptions: MDXOptions?

Because we're interfacing with `next-mdx-remote`, this object allows us to pass in `MDXOptions`. You can see [their documentation](https://github.com/hashicorp/next-mdx-remote#apis) for more details.

### functions

The `createUtils` function generates the following functions based on the provided config object:

#### `await getPaths`: string?

`getPaths` returns an array of paths for generating pages when used in a catchall `[...slug].js`'s `getStaticPaths`. It takes an optional string parameter which overrides the content directory specified in the config object. For example, if you have nested folders and you want paths just for a subset of folders, you could pass that directory in here.

``` js
const paths = await getPaths(); // all paths from content folder
const subSetOfPaths = await getPaths('/content/blog'); // paths from /content/blog folder
```

#### `await getPages`: { meta: object?, frontmatter:object? }: object?

`getPages` returns an array of pages, including frontmatter, metadata, and relational data (everything but the serialized markdown content) based on the files in the content directory specified in the config object. It optionally takes an object that includes keys for `meta` and `frontmatter`, allowing you to filter for a specific subset of pages.

``` js
const drafts = await getPages({ frontmatter: { draft: true } }); // pages set to draft: true
const published = await getPages({ frontmatter: { draft: false } }); // pages set to draft: false
const gardenPosts = await getPages({ frontmatter: { type: 'garden' } }); // pages with type 'garden'
const postsTaggedReactorNextJS = await getPages({ frontmatter: { draft: false, tags: ['react', 'nextjs'] } }); // pages with draft false and tags that include 'react' and/or 'nextjs'
```

#### `getPageProps`: string | string[]

`getPageProps` returns a page, including frontmatter, metadata, relational data, and serialized markdown content based on a provided slug. It is used in conjunction with `getPaths` in a catchall `[...slug].js` file. See the `[...slug].js` in the above [example](#example).

Below, you'll find the object `getPageProps` returns. Note that the `mdx` value should be passed into `next-mdx-remote`'s `MDXRemote` remote component.

``` ts
const {
  params: {
    slug: string[]
  },
  filePath: string,
  content: string,
  frontmatter: any,
  meta: any,
  mdx: MDXRemoteSerializedResult
} = await getPageProps();
```

#### `getPathsByProp`: string

`getPathsByProp` takes a key value in dot notation that corresponds to a page's frontmatter or a piece of meta- or relational data and returns an array of paths that correspond to that prop. You might use something like this if you wanted a list of tags and generate pages for those tags. Below is an example of the `getStaticPaths` and `getStaticProps` to generate tag pages.

``` js
// pages/tag/[tag].js

...

export async function getStaticProps({ params: { tag } }) {
  const posts = await getPages({
    frontmatter: { draft: null, tags: tag }
  });

  return {
    props: {
      tag,
      posts
    }
  };
};

export async function getStaticPaths() {
  const paths = await getPathsByProp('frontmatter.tags');
  const test = paths.map(p => ({ params: { tag: p } }));

  return {
    paths: test,
    fallback: false
  };
}
```

## typescript

`next-mdx-relations` was written in and supports typescript. See the `ts-example` repo for an overview. Types can be exported from `next-mdx-relations`.

``` ts
import { File, MetaGenerator, Page, MDXPage, Params, RelationalGenerator, RelationsConfig, Sort } from 'next-mdx-relations';
```

See [`types.ts`](https://github.com/inadeqtfuturs/next-mdx-relations/blob/main/next-mdx-relations/src/types.ts) for an overview.

## future

`next-mdx-relations` is in early days. Some things I'd like to do moving forward:

- [ ]: more granular `getPathsByProp` api
- [ ]: more granular `getPages` api and control over filtering

Have other ideas? Feel free to file an issue or submit a PR.
