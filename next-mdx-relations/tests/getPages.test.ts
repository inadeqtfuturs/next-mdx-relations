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
      order: nodes =>
        nodes.map((node, index) => ({
          ...node,
          index
        }))
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

describe('`getPages` returns an empty array when no content', () => {
  const { getPages } = createUtils({ content: '/' });
  it('returns an empty array when no content', async () => {
    const pages = await getPages();
    expect(pages).toEqual(expect.any(Array));
    expect(pages.length).toEqual(0);
  });
});
