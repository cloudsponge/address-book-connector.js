import { jsonDataKey } from '../../src/lib/consts';
import {
  computeNextContactsList,
  updateContactsField,
  updateOwnerField,
  submitForm,
} from '../../src/lib/events';
import {
  contactsField,
  ownerField,
  getData,
  setData,
} from '../../src/lib/form';
import { cloudspongeTrigger } from '../../src/lib/cloudsponge';

describe('computeNextContactsList', () => {
  it('adds a manually created contact', () => {
    expect(computeNextContactsList(['email@email.com'], [], [])).toEqual([
      { email: 'email@email.com' },
    ]);
  });
  it('removes a deleted contact', () => {
    const currentList = [
      { email: 'email1' },
      { email: 'email2' },
      { email: 'email' },
    ];
    expect(
      computeNextContactsList(['email2', 'email'], currentList, [])
    ).toEqual([{ email: 'email2' }, { email: 'email' }]);
  });
  it('does not change the list', () => {
    const currentList = [
      { email: 'email1' },
      { email: 'email2' },
      { email: 'email' },
    ];
    expect(
      computeNextContactsList(['email1', 'email2', 'email'], currentList, [])
    ).toEqual(currentList);
  });
  it('adds all from the new list', () => {
    const newList = [
      { email: 'email1' },
      { email: 'email2' },
      { email: 'email' },
    ];
    expect(
      computeNextContactsList(['email1', 'email2', 'email'], [], newList)
    ).toEqual(newList);
  });
});

// mocking form exports
jest.mock('../../src/lib/form', () => ({
  contactsField: jest.fn(),
  ownerField: jest.fn(),
  getData: jest.fn(),
  setData: jest.fn(),
}));

const ownerInput = { value: '', name: 'owner' };
const input = { value: 'email1, email2, email3' };

contactsField.mockImplementation(() => input);
ownerField.mockImplementation(() => ownerInput);
getData.mockImplementation(() => [{}]);

// mocking cloudsponge exports
jest.mock('../../src/lib/cloudsponge', () => ({
  cloudspongeTrigger: jest.fn(),
}));

describe('updateContactsField', () => {
  const contact1 = {
      email: 'email1',
      first_name: 'first1',
      last_name: 'last1',
    },
    contact2 = { email: 'email2', first_name: 'first2', last_name: 'last2' },
    contact3 = { email: 'email3', first_name: 'first3', last_name: 'last3' },
    contact4 = { email: 'email4', first_name: 'first4', last_name: 'last4' };
  it('adds the new contacts objects', () => {
    const contacts = [contact1, contact2, contact3];
    updateContactsField(contacts);
    expect(setData).toHaveBeenCalledWith(input, contacts);
  });
  it('excludes unselected contacts objects', () => {
    const contacts = [contact1, contact2, contact3, contact4];
    updateContactsField(contacts);
    expect(setData).toHaveBeenCalledWith(input, [contact1, contact2, contact3]);
  });
  it('skips setting data when the contacts field is not found', () => {
    contactsField.mockImplementation(() => undefined);
    updateContactsField([]);
    expect(setData).not.toHaveBeenCalled();
  });
});

describe('updateOwnerField', () => {
  it('calls setData', () => {
    const owner = { first_name: 'first', last_name: 'last', email: 'email' };
    updateOwnerField(null, null, owner);
    expect(setData).toHaveBeenCalledWith(ownerInput, owner);
  });
});
