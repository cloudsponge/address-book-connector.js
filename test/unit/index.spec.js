import { setOptions, initialize } from '../../src/index';
import { addScript, thisScript } from '../../src/lib/script';
import options from '../../src/lib/options';

// mock addScript
jest.mock('../../src/lib/script', () => ({
  addScript: jest.fn(),
  thisScript: {},
}));

beforeEach(() => {
  // clear the options object of data that was in it from the previous run
  for (let key of Object.keys(options)) {
    delete options[key];
  }
});

describe('options', () => {
  it('initializes the options', () => {
    expect(options).toEqual({});
  });
});

describe('setOptions', () => {
  it('updates the options', () => {
    setOptions({ option: 'option' });
    expect(options).toEqual({ option: 'option' });
  });
  it('merges options', () => {
    options.existingOptions = {};
    setOptions({ newOptions: {} });
    expect(options).toEqual({ existingOptions: {}, newOptions: {} });
  });
  it('overwrites options', () => {
    options.niceOption = 42;
    setOptions({ niceOption: 0 });
    expect(options).toEqual({ niceOption: 0 });
  });
  it('adds the cloudsponge script', () => {
    setOptions({ key: 'thisIsAKey' });
    expect(addScript).toHaveBeenCalled();
  });
});

describe('initialize', () => {
  it('does not set the options without a key', () => {
    // mocking thisScript: because it's an empty object we just assign the data that we expect
    thisScript.dataset = { notAKey: 'yo' };
    initialize();
    expect(options).toEqual({});
  });
  it('does not set the options (empty) without a key', () => {
    initialize();
    expect(options).toEqual({});
  });
  it('sets the Options', () => {
    // mocking thisScript: because it's an empty object we just assign the data that we expect
    thisScript.dataset = { key: 'yo' };
    initialize();
    expect(options.key).toEqual('yo');
    delete thisScript.dataset;
  });
});
