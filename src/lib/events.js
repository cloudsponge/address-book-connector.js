import {
  form,
  dataField,
  contactsField,
  ownerField,
  getData,
  setData,
} from './form';
import { getContact, contactObject } from './contacts';
import options from './options';

// using our list of emails as the master, pick contact objects from either list
//  to create our next list of contacts
export const computeNextContactsList = (emails, list1, list2, opts) => {
  return emails.map(email => {
    return getContact(list1, list2, email, opts);
  });
};

// assigns a JSON object to the contacts field for form submission
export const updateContactsField = newContacts => {
  const opts = {};
  opts.subject = options.subject && (options.subject.default || options.subject);
  if (!opts.subject) {
    const subjectField = dataField('subject');
    opts.subject = subjectField && subjectField.value;
  }

  const contactsInput = contactsField();
  if (contactsInput) {
    // the textarea has already been populated now
    const selectedEmails = contactsInput.value.split(/[,\s]+/);
    // current contacts objects that were previously stored
    const currentContacts = getData(contactsInput);
    // make the data agree with the comma separated list of emails displayed
    //  this means that if emails were added or subtracted manually, the data needs to be
    //  adjusted accodingly.
    const nextContacts = computeNextContactsList(
      selectedEmails,
      currentContacts,
      newContacts,
      opts
    );
    setData(contactsInput, nextContacts);
  }

  // trigger the callback if new contacts were added
  if (newContacts && newContacts.length) {
    options.onUpdateContacts &&
      options.onUpdateContacts.call &&
      options.onUpdateContacts(newContacts);
  }
};

// serialize the owner object into the owner field's dataset
export const updateOwnerField = (contacts, source, owner) => {
  setData(ownerField(), contactObject(owner, { owner: true }));
  owner &&
    options.onUpdateOwner &&
    options.onUpdateOwner.call &&
    options.onUpdateOwner(owner);
};
