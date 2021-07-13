import { createUtils } from '../src';

describe('`getPaths` functionality', () => {
  const { getPaths } = createUtils({ content: '/content' });
  it('returns a `getPaths` function', () => {
    expect(getPaths).toEqual(expect.any(Function));
  });
  it('returns an array of paths', async () => {
    const paths = await getPaths();
    expect(paths).toEqual(expect.any(Array));
    expect(paths.length).toBe(3);
  });
  it('returns paths w/ `params` based on filesystem', async () => {
    const paths = await getPaths();
    paths.forEach(path => {
      expect(path).toHaveProperty('params');
      expect(path.params).toHaveProperty('slug');
    });
  });
  it('can take an alternative path param', async () => {
    const paths = await getPaths('/');
    expect(paths).toEqual(expect.any(Array));
    expect(paths.length).toBe(0);
  });
});
