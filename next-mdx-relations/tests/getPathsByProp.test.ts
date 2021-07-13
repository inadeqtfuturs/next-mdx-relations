import { createUtils } from '../src';

describe('`getPageProps` functionality', () => {
  const { getPathsByProp } = createUtils({
    content: '/content'
  });

  it('returns a list of pages for a given prop', async () => {
    const paths = await getPathsByProp('frontmatter.tags');
    expect(paths).toEqual(expect.any(Array));
    expect(paths.length).toEqual(4);
  });
  it('returns a list of pages for a given prop (string)', async () => {
    const paths = await getPathsByProp('frontmatter.title');
    expect(paths).toEqual(expect.any(Array));
    expect(paths.length).toEqual(3);
  });
  it('skips paths when not present on page/frontmatter', async () => {
    const paths = await getPathsByProp('frontmatter.secret');
    expect(paths).toEqual(expect.any(Array));
    expect(paths).toEqual(['42']);
  });
  it('returns an empty array when no matching props', async () => {
    const paths = await getPathsByProp('frontmatter.one-off');
    expect(paths).toEqual(expect.any(Array));
    expect(paths.length).toEqual(0);
  });
});
