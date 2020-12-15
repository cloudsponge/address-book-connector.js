import options from '../../src/lib/options';

describe('options', () => {
  it('loads', () => {
    expect(options).toEqual({
      cloudspongeOptions: {},
    });
  });
});
