import { createUtils } from '../src';

describe('`getPages` functionality', () => {
  const { getPages } = createUtils({
    content: '/content',
    sort: {
      by: 'frontmatter.title',
      order: 'asc'
    },
    slugRewrites: {
      blog: 'garden'
    },
    metaGenerators: {
      titleLength: node => node.frontmatter?.title?.length || 0
    },
    relationGenerators: {
      order: (_, index) => index
    }
  });

  it('returns a `getPages` function', () => {
    expect(getPages).toEqual(expect.any(Function));
  });

  it('returns an array of pages', async () => {
    const pages = await getPages();
    expect(pages).toEqual(expect.any(Array));
    expect(pages.length).toEqual(3);
  });

  it('returns pages with a file path, params, and content', async () => {
    const pages = await getPages();
    pages.forEach(page => {
      expect(page).toHaveProperty('filePath');
      expect(page).toHaveProperty('params');
      expect(page).toHaveProperty('content');
    });
  });

  it('can filter by frontmatter `react`', async () => {
    const pages = await getPages({ frontmatter: { tags: 'react' } });
    expect(pages).toEqual(expect.any(Array));
    pages.forEach(page => {
      expect(page?.frontmatter?.tags).toEqual(
        expect.arrayContaining(['react'])
      );
    });
  });

  it('can filter by frontmatter `random`', async () => {
    const pages = await getPages({ frontmatter: { tags: 'random' } });
    expect(pages).toEqual(expect.any(Array));
    pages.forEach(page => {
      expect(page?.frontmatter?.tags).toEqual(
        expect.arrayContaining(['random'])
      );
    });
  });

  it('returns an empty array when no page matches filter', async () => {
    const pages = await getPages({ frontmatter: { tags: 'test' } });
    expect(pages).toEqual(expect.any(Array));
    expect(pages.length).toEqual(0);
  });

  it('creates new metadata', async () => {
    const pages = await getPages();
    pages.forEach(page => {
      expect(page).toHaveProperty('meta');
      expect(page?.meta).toHaveProperty('titleLength');
    });
  });
});

describe('`getPages` filtering functionality', () => {
  const { getPages } = createUtils({
    content: '/content',
    sort: {
      by: 'frontmatter.title',
      order: 'desc'
    },
    metaGenerators: {
      titleLength: node => node.frontmatter?.title?.length || 0
    }
  });

  it('does not have to filter', async () => {
    const pages = await getPages(undefined);
    expect(pages.length).toEqual(3);
  });

  it('filters by matching arrays', async () => {
    const pages = await getPages({
      frontmatter: { tags: ['react', 'nextjs'] }
    });
    expect(pages.length).toEqual(1);
  });

  it('filters by checking if string is in array', async () => {
    const pages = await getPages({
      frontmatter: { title: ['Post 1'] },
      meta: { titleLength: 6 }
    });
    expect(pages.length).toEqual(1);
  });

  it('filters by checking boolean value', async () => {
    const pages = await getPages({
      frontmatter: { featured: true }
    });
    expect(pages.length).toEqual(1);
  });

  it('filters if values match (usually string)', async () => {
    const pages = await getPages({
      frontmatter: { title: 'Post 1' }
    });
    expect(pages.length).toEqual(1);
  });
});

describe('`getPages` returns an empty array when no content -- ex. empty or missing directory', () => {
  const { getPages } = createUtils({ content: '/content/projects' });

  it('returns an empty array when no content', async () => {
    const pages = await getPages();
    expect(pages).toEqual(expect.any(Array));
    expect(pages.length).toEqual(0);
  });
});

describe('`getPages` relational generators', () => {
  const { getPages } = createUtils({
    content: '/content',
    sort: {
      by: 'frontmatter.title',
      order: 'asc'
    },
    slugRewrites: {
      blog: 'garden'
    },
    metaGenerators: {
      titleLength: node => node.frontmatter?.title?.length || 0
    },
    relationGenerators: {
      order: (_, index) => index,
      '[r1, r2]': () => ({
        r1: Math.random(),
        r2: Math.random()
      }),
      object: () => ({
        r3: Math.random()
      }),
      length: {
        transform: nodes =>
          nodes.sort(
            ({ meta: { titleLength: a } }, { meta: { titleLength: b } }) =>
              b - a
          ),
        map: (_, i) => i
      }
    }
  });

  // key: {
  //  transform: [] => []
  //  map: (item, index, array) => any
  // }
  //
  // key: (item, index, array) => any

  it('adds relations to `meta` of each page', async () => {
    const pages = await getPages();
    pages.forEach(page => {
      expect(page).toHaveProperty('meta');
      expect(page.meta).toHaveProperty('r1');
      expect(page.meta).toHaveProperty('order');
    });
  });

  it('adds relations to correct name space (ex. order)', async () => {
    const pages = await getPages();
    pages.forEach(page => {
      expect(page).toHaveProperty('meta');
      expect(page.meta).toHaveProperty('order');
      expect(page.meta.order).toEqual(expect.any(Number));
    });
  });

  it('adds multiple relations to correct name space (ex. [r1, r2])', async () => {
    const pages = await getPages();
    pages.forEach(page => {
      expect(page).toHaveProperty('meta');
      expect(page.meta).toHaveProperty('r1');
      expect(page.meta.r1).toEqual(expect.any(Number));
    });
  });

  it('adds nested relation to correct name space (ex. object)', async () => {
    const pages = await getPages();
    pages.forEach(page => {
      expect(page).toHaveProperty('meta');
      expect(page.meta).toHaveProperty('object');
      expect(page.meta.object).toEqual({ r3: expect.any(Number) });
    });
  });
});
