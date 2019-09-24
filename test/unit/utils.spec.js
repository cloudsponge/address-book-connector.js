import {
  isObj,
  isNull,
  isNum,
  isFunc,
  isArr,
  isStr,
  isUndef,
  isBool,
} from '../../src/lib/utils';

describe('isObj', () => {
  const detectFunc = isObj;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(true);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(false);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(false);
    expect(detectFunc(undefined)).toBe(false);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(false);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(false);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(false);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(false);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(false);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(false);
  });
});

describe('isNull', () => {
  const detectFunc = isNull;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(false);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(true);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(false);
    expect(detectFunc(undefined)).toBe(false);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(false);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(false);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(false);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(false);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(false);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(false);
  });
});

describe('isNum', () => {
  const detectFunc = isNum;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(false);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(false);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(false);
    expect(detectFunc(undefined)).toBe(false);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(false);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(false);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(true);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(false);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(false);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(false);
  });
});

describe('isFunc', () => {
  const detectFunc = isFunc;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(false);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(false);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(false);
    expect(detectFunc(undefined)).toBe(false);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(false);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(false);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(false);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(true);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(false);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(false);
  });
});

describe('isArr', () => {
  const detectFunc = isArr;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(false);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(false);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(false);
    expect(detectFunc(undefined)).toBe(false);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(false);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(true);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(false);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(false);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(false);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(false);
  });
});

describe('isStr', () => {
  const detectFunc = isStr;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(false);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(false);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(false);
    expect(detectFunc(undefined)).toBe(false);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(true);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(false);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(false);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(false);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(false);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(false);
  });
});

describe('isUndef', () => {
  const detectFunc = isUndef;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(false);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(false);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(true);
    expect(detectFunc(undefined)).toBe(true);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(false);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(false);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(false);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(false);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(false);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(false);
  });
});

describe('isBool', () => {
  const detectFunc = isBool;
  it('detects {}', () => {
    expect(detectFunc({})).toBe(false);
  });
  it('detects null', () => {
    expect(detectFunc(null)).toBe(false);
  });
  it('detects undefined', () => {
    expect(detectFunc()).toBe(false);
    expect(detectFunc(undefined)).toBe(false);
  });
  it('detects string', () => {
    expect(detectFunc('hi')).toBe(false);
  });
  it('detects []', () => {
    expect(detectFunc([])).toBe(false);
  });
  it('detects 1', () => {
    expect(detectFunc(1)).toBe(false);
  });
  it('detects function', () => {
    expect(detectFunc(() => {})).toBe(false);
  });
  it('detects true', () => {
    expect(detectFunc(true)).toBe(true);
  });
  it('detects false', () => {
    expect(detectFunc(false)).toBe(true);
  });
});
