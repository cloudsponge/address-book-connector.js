import {
  findScript,
  thisScript,
  script,
  csScriptSrc,
  addScript,
} from '../../src/lib/script';

jest.spyOn(document, 'querySelector');

// mock the parentElement object for the 'script' function
thisScript.parentElement = { appendChild: jest.fn() };

describe('findScript', () => {
  // mock the document.currentScript getter by redefining it to point to one of our scripts
  const currentScript = { name: 'current' };
  const foundScript = { name: 'found' };
  let whichScript = currentScript;
  Object.defineProperty(document, 'currentScript', { get: () => whichScript });

  it('returns the currentScript', () => {
    expect(findScript()).toEqual(currentScript);
  });
  it('finds the script', () => {
    whichScript = null;
    document.querySelector.mockImplementation(() => foundScript);
    expect(findScript()).toEqual(foundScript);
  });
});

describe('csScriptSrc', () => {
  it('includes the key, default host on HTTPS', () => {
    expect(csScriptSrc({ key: 'thisIsTheKey' })).toEqual(
      'https://api.cloudsponge.com/widget/thisIsTheKey.js'
    );
  });
  it('works on non-HTTPS', () => {
    expect(csScriptSrc({ key: 'thisIsTheKey', insecure: true })).toEqual(
      'http://api.cloudsponge.com/widget/thisIsTheKey.js'
    );
  });
  it('uses a specific host', () => {
    expect(csScriptSrc({ key: 'thisIsTheKey', host: 'example.com' })).toEqual(
      'https://example.com/widget/thisIsTheKey.js'
    );
  });
});

describe('script', () => {
  it('invokes the callback when the script is found', () => {
    document.querySelector.mockImplementation(() => true);
    const callback = jest.fn();
    script('', callback);
    expect(callback).toHaveBeenCalled();
  });
  it('skips callback when not a function', () => {
    document.querySelector.mockImplementation(() => true);
    expect(() => script('')).not.toThrow();
  });
  it('adds the script to the page', () => {
    document.querySelector.mockImplementation(() => false);
    script('newscript');
    expect(thisScript.parentElement.appendChild).toHaveBeenCalled();
  });
});

describe('addScript', () => {
  it('does nothing when key is not defined', () => {
    addScript({});
    expect(thisScript.parentElement.appendChild).not.toHaveBeenCalled();
  });
  it('appendsChild when the key is defined', () => {
    addScript({ key: 'wazzup' });
    expect(thisScript.parentElement.appendChild).toHaveBeenCalled();
  });
});
