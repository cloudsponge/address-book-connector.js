import {
  contactObject,
  getContact,
  findContactData,
} from '../../src/lib/contacts';

describe('contactObject', () => {
  it('returns a flattened email', () => {
    expect(
      contactObject({ email: [{ address: 'email@example.com' }] }).email
    ).toEqual('email@example.com');
  });

  it('returns a pre-flattened email', () => {
    expect(contactObject({ email: 'email@example.com' }).email).toEqual(
      'email@example.com'
    );
  });
});

describe('getContact', () => {
  it('picks a contact object from the first list', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      email: 'email@example.com',
    };
    expect(getContact([matchingContact], [], 'email@example.com')).toEqual(
      matchingContact
    );
  });

  it('picks a contact object from the second list', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      email: 'email@example.com',
    };
    expect(getContact([], [matchingContact], 'email@example.com')).toEqual(
      matchingContact
    );
  });

  it('returns the email as an object when there is no match', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      email: 'email@example.com',
    };
    expect(getContact([matchingContact], [], 'email2@example.com')).toEqual({
      email: 'email2@example.com',
    });
  });
});

describe('findContactData', () => {
  it('gets the contact by __selectedMail__', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      __selectedMail__: 'email@example.com',
    };
    expect(findContactData([matchingContact], 'email@example.com')).toEqual(
      matchingContact
    );
  });

  it('gets the contact by email', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      email: 'email@example.com',
    };
    expect(findContactData([matchingContact], 'email@example.com')).toEqual(
      matchingContact
    );
  });

  it('returns nothing', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      __selectedMail__: 'email@example.com',
    };
    expect(
      findContactData([matchingContact], '__no_email@example.com')
    ).toBeFalsy();
  });
});
