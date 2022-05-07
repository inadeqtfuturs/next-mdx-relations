import { getPathValues, getValueFromPath } from '../src/utils';

describe('getValueFromPath', () => {
  it('throws an error if path is neither a string or array of strings', () => {
    expect(() => getValueFromPath({}, {})).toThrow();
  });
});

describe('getPathValues', () => {
  const testObject = {
    a: 24,
    b: [1, 2, 3],
    deep: {
      deeper: [{ test: 24 }],
      a: 24
    }
  };

  expect(getPathValues(testObject)).toEqual([
    { objectPath: ['a'], value: 24 },
    { objectPath: ['b'], value: [1, 2, 3] },
    { objectPath: ['deep', 'deeper'], value: [{ test: 24 }] },
    { objectPath: ['deep', 'a'], value: 24 }
  ]);
});
