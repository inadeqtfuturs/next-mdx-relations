import createUtils from '../src';

describe('initialize createUtils', () => {
  it('returns util functions', () => {
    const utils = createUtils({ content: '/path' });
    expect(utils).toEqual({
      getPaths: expect.any(Function),
      getPathsByProp: expect.any(Function),
      getPages: expect.any(Function),
      getPageProps: expect.any(Function)
    });
  });
});
