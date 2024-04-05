import {
  contactObject,
  getContact,
  findContactData,
} from '../../src/lib/contacts';

import options from '../../src/lib/options';
beforeEach(() => {
  // clear the options object of data that was in it from the previous run
  for (let key of Object.keys(options)) {
    delete options[key];
  }
});

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

  // specs for subject and personalSubject
  describe('subject', () => {
    it('returns nothing', () => {
      const contact = {};
      expect(contactObject(contact).subject).toBe(undefined);
    });
    it('returns the subject', () => {
      const opts = { subject: 'this is an email subject' };
      const contact = {};
      expect(contactObject(contact, opts).subject).toEqual(
        'this is an email subject'
      );
    });

    it('returns the default subject', () => {
      const opts = { subject: { default: 'this is an email subject' } };
      const contact = {};
      expect(contactObject(contact, opts).subject).toEqual(
        'this is an email subject'
      );
    });
  });

  describe('personal_subject', () => {
    it('returns nothing', () => {
      const contact = {};
      expect(contactObject(contact).personal_subject).toBe(undefined);
    });
    it('returns the subject', () => {
      const opts = { subject: 'this is an email subject' };
      const contact = {};
      expect(contactObject(contact, opts).personal_subject).toEqual(
        'this is an email subject'
      );
    });
    it('returns the personal_subject', () => {
      const opts = { subject: 'this is an email subject' };
      const contact = { first_name: 'dude' };
      expect(contactObject(contact, opts).personal_subject).toEqual(
        'dude this is an email subject'
      );
    });
  });

  describe('to', () => {
    it('returns the email', () => {
      const contact = { email: 'email@example.com' };
      expect(contactObject(contact).to).toEqual('email@example.com');
    });
    it('returns the formated email with first name', () => {
      const contact = { email: 'email@example.com', first_name: 'first' };
      expect(contactObject(contact).to).toEqual('first <email@example.com>');
    });
    it('returns the formated email with last name', () => {
      const contact = { email: 'email@example.com', last_name: 'last' };
      expect(contactObject(contact).to).toEqual('last <email@example.com>');
    });
    it('returns the formated email with full name', () => {
      const contact = {
        email: 'email@example.com',
        first_name: 'yo',
        last_name: 'last',
      };
      expect(contactObject(contact).to).toEqual('yo last <email@example.com>');
    });
  });

  describe('the owner object', () => {
    describe('sender_name', () => {
      it('can be empty', () => {
        const contact = { email: 'email@example.com' };
        expect(contactObject(contact, { owner: true }).sender_name).toEqual('');
      });
      it('can be the default', () => {
        const contact = { email: 'email@example.com' };
        options.defaultSenderName = 'defaultSenderName';
        expect(contactObject(contact, { owner: true }).sender_name).toEqual(
          'defaultSenderName'
        );
      });
      it('can be the first and last name', () => {
        const contact = {
          first_name: 'sender',
          last_name: 'name',
          email: 'email@example.com',
        };
        options.defaultSenderName = 'defaultSenderName';
        expect(contactObject(contact, { owner: true }).sender_name).toEqual(
          'sender name'
        );
      });
    });
    describe('from_name', () => {
      it('can be empty', () => {
        const contact = { email: 'email@example.com' };
        expect(contactObject(contact, { owner: true }).from_name).toEqual('');
      });
      it('can be the default', () => {
        const contact = { email: 'email@example.com' };
        options.defaultSenderName = 'defaultSenderName';
        expect(contactObject(contact, { owner: true }).from_name).toEqual(
          'defaultSenderName'
        );
      });
      it('can be the first and last name', () => {
        const contact = {
          first_name: 'sender',
          last_name: 'name',
          email: 'email@example.com',
        };
        options.defaultSenderName = 'defaultSenderName';
        expect(contactObject(contact, { owner: true }).from_name).toEqual(
          'sender name'
        );
      });
    });
    describe('sender_email', () => {
      it('is always present', () => {
        const contact = { email: 'email@example.com' };
        expect(contactObject(contact, { owner: true }).sender_email).toEqual(
          ''
        );
      });
      it('can be present', () => {
        const contact = { email: 'email@example.com' };
        options.senderEmail = 'senderEmail@nowhere.com';
        expect(contactObject(contact, { owner: true }).sender_email).toEqual(
          'senderEmail@nowhere.com'
        );
      });
    });
    describe('reply_to_name', () => {
      // ownerName || options.defaultReplyToName || options.defaultSenderName
      it('can be empty', () => {
        const contact = { email: 'email@example.com' };
        expect(contactObject(contact, { owner: true }).reply_to_name).toEqual(
          ''
        );
      });
      it('can be the defaultSenderName', () => {
        const contact = { email: 'email@example.com' };
        options.defaultSenderName = 'some sender';
        expect(contactObject(contact, { owner: true }).reply_to_name).toEqual(
          'some sender'
        );
      });
      it('can be the defaultReplyToName', () => {
        const contact = { email: 'email@example.com' };
        options.defaultSenderName = 'some sender';
        options.defaultReplyToName = 'replyto name';
        expect(contactObject(contact, { owner: true }).reply_to_name).toEqual(
          'replyto name'
        );
      });
      it('can be the ownerName', () => {
        const contact = {
          first_name: 'owner',
          last_name: 'lastname',
          email: 'email@example.com',
        };
        options.defaultSenderName = 'some sender';
        options.defaultReplyToName = 'replyto name';
        expect(contactObject(contact, { owner: true }).reply_to_name).toEqual(
          'owner lastname'
        );
      });
    });
    describe('reply_to_email', () => {
      // options.replyToEmail || obj.email || options.defaultReplyToEmail || ''
      it('can be empty', () => {
        const contact = {};
        expect(contactObject(contact, { owner: true }).reply_to_email).toEqual(
          ''
        );
      });
      it('can be the defaultReplyToEmail', () => {
        const contact = {};
        options.defaultReplyToEmail = 'default_replyto@example.com';
        expect(contactObject(contact, { owner: true }).reply_to_email).toEqual(
          'default_replyto@example.com'
        );
      });
      it('can be the owner email', () => {
        const contact = { email: 'email.example.com' };
        options.defaultReplyToEmail = 'default_replyto@example.com';
        expect(contactObject(contact, { owner: true }).reply_to_email).toEqual(
          'email.example.com'
        );
      });
      it('can be the set replyToEmail', () => {
        const contact = { email: 'email@example.com' };
        options.defaultReplyToEmail = 'default_replyto@example.com';
        options.replyToEmail = 'replyto@example.com';
        expect(contactObject(contact, { owner: true }).reply_to_email).toEqual(
          'replyto@example.com'
        );
      });
    });
  });
});

describe('getContact', () => {
  it('picks a contact object from the first list', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      email: 'email@example.com',
    };
    expect(getContact([matchingContact], [], 'email@example.com')).toEqual({
      ...matchingContact,
      greeting: 'Hi first',
      to: 'first last <email@example.com>',
    });
  });

  it('picks a contact object from the second list', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      email: 'email@example.com',
    };
    expect(getContact([], [matchingContact], 'email@example.com')).toEqual({
      ...matchingContact,
      to: 'first last <email@example.com>',
      greeting: 'Hi first',
    });
  });

  it('returns the email as an object when there is no match', () => {
    const matchingContact = {
      first_name: 'first',
      last_name: 'last',
      email: 'email@example.com',
    };
    expect(getContact([matchingContact], [], 'email2@example.com')).toEqual({
      email: 'email2@example.com',
      to: 'email2@example.com',
      greeting: 'Hi',
      first_name: '',
      last_name: '',
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
