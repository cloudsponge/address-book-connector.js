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
  dataField,
  getData,
  setData,
} from '../../src/lib/form';
import { cloudspongeTrigger } from '../../src/lib/cloudsponge';

import options from '../../src/lib/options';
beforeEach(() => {
  // clear the options object of data that was in it from the previous run
  for (let key of Object.keys(options)) {
    delete options[key];
  }
});

describe('computeNextContactsList', () => {
  it('adds a manually created contact', () => {
    expect(computeNextContactsList(['email@email.com'], [], [])).toEqual([
      {
        email: 'email@email.com',
        first_name: '',
        last_name: '',
        greeting: 'Hi',
        to: 'email@email.com',
      },
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
    ).toEqual([
      {
        email: 'email2',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email2',
      },
      {
        email: 'email',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email',
      },
    ]);
  });

  it('does not change the list', () => {
    const currentList = [
      { email: 'email1' },
      { email: 'email2' },
      { email: 'email' },
    ];
    expect(
      computeNextContactsList(['email1', 'email2', 'email'], currentList, [])
    ).toEqual([
      {
        email: 'email1',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email1',
      },
      {
        email: 'email2',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email2',
      },
      {
        email: 'email',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email',
      },
    ]);
  });

  it('adds all from the new list', () => {
    const newList = [
      { email: 'email1' },
      { email: 'email2' },
      { email: 'email' },
    ];
    expect(
      computeNextContactsList(['email1', 'email2', 'email'], [], newList)
    ).toEqual([
      {
        email: 'email1',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email1',
      },
      {
        email: 'email2',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email2',
      },
      {
        email: 'email',
        first_name: '',
        greeting: 'Hi',
        last_name: '',
        to: 'email',
      },
    ]);
  });
});

// mocking form exports
jest.mock('../../src/lib/form', () => ({
  contactsField: jest.fn(),
  ownerField: jest.fn(),
  dataField: jest.fn(),
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

  it('calls the onUpdate callback', () => {
    options.onUpdateContacts = jest.fn();
    updateContactsField([contact1]);
    expect(options.onUpdateContacts).toHaveBeenCalledWith([contact1]);
  });

  it('adds the new contacts objects', () => {
    options.onUpdateContacts = jest.fn();
    const contacts = [contact1, contact2, contact3];
    updateContactsField(contacts);
    expect(setData).toHaveBeenCalledWith(input, [
      {
        ...contact1,
        greeting: 'Hi first1',
        to: 'first1 last1 <email1>',
      },
      {
        ...contact2,
        greeting: 'Hi first2',
        to: 'first2 last2 <email2>',
      },
      {
        ...contact3,
        greeting: 'Hi first3',
        to: 'first3 last3 <email3>',
      },
    ]);
    expect(options.onUpdateContacts).toHaveBeenCalled();
  });

  it('excludes unselected contacts objects', () => {
    const contacts = [contact1, contact2, contact3, contact4];
    updateContactsField(contacts);
    expect(setData).toHaveBeenCalledWith(input, [
      {
        ...contact1,
        greeting: 'Hi first1',
        to: 'first1 last1 <email1>',
      },
      {
        ...contact2,
        greeting: 'Hi first2',
        to: 'first2 last2 <email2>',
      },
      {
        ...contact3,
        greeting: 'Hi first3',
        to: 'first3 last3 <email3>',
      },
    ]);
  });

  it('skips setting data when the contacts field is not found', () => {
    contactsField.mockImplementation(() => undefined);
    updateContactsField([]);
    expect(setData).not.toHaveBeenCalled();
  });

  it('gets the subject from a dataField', () => {
    dataField.mockImplementation(() => null);
    updateContactsField([]);
    expect(dataField).toHaveBeenCalled();
  });

  it('gets the subject from the options', () => {
    options.subject = 'optional subject';
    updateContactsField([]);
    expect(dataField).not.toHaveBeenCalled();
  });

  it('gets the default subject from the options', () => {
    options.subject = { default: 'optional subject' };
    updateContactsField([]);
    expect(dataField).not.toHaveBeenCalled();
  });

  it('uses the subject from a dataField', () => {
    dataField.mockImplementation(() => {
      return { value: 'subject' };
    });
    updateContactsField([]);
    expect(dataField).toHaveBeenCalled();
  });
});

describe('updateOwnerField', () => {
  it('calls setData', () => {
    options.onUpdateOwner = jest.fn();
    const owner = { first_name: 'first', last_name: 'last', email: 'email' };
    updateOwnerField(null, null, owner);
    expect(setData).toHaveBeenCalledWith(ownerInput, {
      ...owner,
      from_name: 'first last',
      sender_name: 'first last',
      reply_to_email: 'email',
      reply_to_name: 'first last',
      sender_email: "",
    });
    expect(options.onUpdateOwner).toHaveBeenCalled();
  });
  it('calls onUpdateOwner callback', () => {
    options.onUpdateOwner = jest.fn();
    const owner = { first_name: 'first', last_name: 'last', email: 'email' };
    updateOwnerField(null, null, owner);
    expect(options.onUpdateOwner).toHaveBeenCalledWith(owner);
  });
});
