import { jsonDataKey } from '../../src/lib/consts';
import {
  form,
  ownerField,
  contactsField,
  getData,
  setData,
  serializeForm,
  inputKey,
  isContactField,
} from '../../src/lib/form';

// mock document.querySelector
const formElement = {
  type: 'form',
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
};
const ownerElement = {
  type: 'input',
  name: 'owner',
};
const contactsElement = {
  type: 'input',
  name: 'contacts',
  className: 'cloudsponge-contacts',
};

jest.spyOn(document, 'querySelector').mockImplementation(() => formElement);

beforeEach(() => {
  // initialize the mock functions
  document.querySelector.mockImplementation(() => formElement);
  // reset the counters
  document.querySelector.mockClear();
});

describe('form', () => {
  it('returns a form element', () => {
    expect(form()).toBe(formElement);
    expect(document.querySelector).toHaveBeenCalled();
  });
  it('returns nothing', () => {
    document.querySelector.mockImplementation(() => null);

    expect(form()).toBe(null);
    expect(document.querySelector).toHaveBeenCalled();
  });
});

describe('ownerField', () => {
  it('returns an element', () => {
    formElement.querySelector.mockImplementation(() => ownerElement);

    expect(ownerField()).toBe(ownerElement);
    expect(formElement.querySelector).toHaveBeenCalled();
  });
  it('returns nothing', () => {
    formElement.querySelector.mockImplementation(() => null);

    expect(ownerField()).toBe(null);
    expect(formElement.querySelector).toHaveBeenCalled();
  });
});

describe('contactsField', () => {
  it('returns an element', () => {
    formElement.querySelector.mockImplementation(() => contactsElement);

    expect(contactsField()).toBe(contactsElement);
    expect(formElement.querySelector).toHaveBeenCalled();
  });
  it('returns nothing', () => {
    formElement.querySelector.mockImplementation(() => null);

    expect(contactsField()).toBe(null);
    expect(formElement.querySelector).toHaveBeenCalled();
  });
});

describe('getData', () => {
  it('gets the default value', () => {
    expect(getData({})).toEqual([]);
  });
  it('gets the custom default value', () => {
    expect(getData({}, 'defaultValue')).toBe('defaultValue');
  });
  it('gets the data from the dataset of the element', () => {
    const dataElement = {
      value: 'ignore me',
      dataset: { [jsonDataKey]: '{"data":"correct!"}' },
    };
    expect(getData(dataElement).data).toBe('correct!');
  });
});

describe('setData', () => {
  it('sets the dataset attribute', () => {
    const element = {
      dataset: { [jsonDataKey]: '{"data":"old value"}' },
    };
    setData(element, { data: 'new value' });
    expect(element.dataset[jsonDataKey]).toEqual('{"data":"new value"}');
  });
  it('handles falsey values', () => {
    expect(() => setData(null, {})).not.toThrow();
  });
});

describe('isContactField', () => {
  it('returns true for an element with the appropriate className', () => {
    expect(isContactField({ className: 'cloudsponge-contacts' })).toBe(true);
  });
  it('returns true for an element with the appropriate className, among others', () => {
    expect(
      isContactField({
        className: 'other-class cloudsponge-contacts still-more-classes',
      })
    ).toBe(true);
  });
  it('returns false for an element without the appropriate className', () => {
    expect(isContactField({ className: '' })).toBe(false);
  });
  it('returns false for an element without any classNames', () => {
    expect(isContactField({})).toBe(false);
  });
});

describe('inputKey', () => {
  it('returns "contacts" for the special field', () => {
    const input = {
      id: 'theID',
      name: 'theName',
      dataset: { addressBookConnectorName: 'theShareName' },
      className: 'cloudsponge-contacts',
    };
    expect(inputKey(input)).toBe('contacts');
  });
  it('returns the sharing name from the data- attribute', () => {
    const input = {
      id: 'theID',
      name: 'theName',
      dataset: { addressBookConnectorName: 'theShareName' },
    };
    expect(inputKey(input)).toBe('theShareName');
  });
  it('returns the name', () => {
    const input = { id: 'theID', name: 'theName' };
    expect(inputKey(input)).toBe('theName');
  });
  it('returns the id', () => {
    const input = { id: 'theID' };
    expect(inputKey(input)).toBe('theID');
  });
  it('returns undefined', () => {
    const input = {};
    expect(inputKey(input)).toBe(undefined);
  });
});

describe('serializeForm', () => {
  it('returns null when there is no form found', () => {
    document.querySelector.mockImplementation(() => null);
    expect(serializeForm()).toBe(null);
  });
  it('returns an empty obj when there are no fields in the form', () => {
    formElement.querySelectorAll.mockImplementation(() => []);
    expect(serializeForm()).toEqual({});
  });
  it('returns the form data as an object', () => {
    const input = {
        type: 'input',
        className: 'cloudsponge-contacts',
        dataset: { [jsonDataKey]: '[]' },
      },
      select = { type: 'select', dataset: { addressBookConnectorName: 'selecty' }, value: 1 },
      textarea = { type: 'textarea', value: 'some text', id: 'texty' };
    formElement.querySelectorAll.mockImplementation(() => [
      input,
      select,
      textarea,
    ]);

    expect(serializeForm()).toEqual({
      contacts: [],
      selecty: 1,
      texty: 'some text',
    });
  });
});
