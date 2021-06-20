import createUtils from '../src';

describe('`getPageProps` functionality', () => {
  const { getPageProps } = createUtils({
    content: '/content'
  });

  it('returns props for a given page', async () => {
    const pageProps = await getPageProps(['blog', 'post-01']);
    expect(pageProps).toEqual(expect.any(Object));
    expect(pageProps?.frontmatter?.title).toEqual('Post 1');
  });
  it('returns null when page does not exist', async () => {
    const pageProps = await getPageProps(['wrong', 'route']);
    expect(pageProps).toEqual(null);
  });
});
