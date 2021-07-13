import { createUtils } from '../src';

describe('`getValueFromPath` functionality', () => {
  const { getPages } = createUtils({
    content: '/content',
    sort: undefined
  });

  it('returns an error w/out sort info', async () => {
    const pages = await getPages();
    expect(pages).toEqual(expect.any(Array));
  });
});
