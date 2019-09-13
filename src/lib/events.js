import { form, contactsField, ownerField, getData, setData } from './form';
import { getContact, contactObject } from './contacts';

// using our list of emails as the master, pick contact objects from either list
//  to create our next list of contacts
export const computeNextContactsList = (emails, list1, list2) => {
  return emails.map(email => {
    return getContact(list1, list2, email);
  });
};

// assigns a JSON object to the contacts field for form submission
export const updateContactsField = newContacts => {
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
      newContacts
    );
    setData(contactsInput, nextContacts);
  }
};

// serialize the owner object into the owner field's dataset
export const updateOwnerField = (contacts, source, owner) => {
  setData(ownerField(), contactObject(owner));
};
