/* Contact storage */

// selected contacts are stored as JSON data within the DOM as 'data-' attributes. When the form is submitted,
// these attributes are merged with manually input data for submission to the cloudsponge.trigger function.

export function findContactData(list, email) {
  return list.find(c => {
    return c.email == email || c.__selectedMail__ == email;
  });
}

export function getContact(list1, list2, email) {
  const contactData = findContactData(list1, email) ||
    findContactData(list2, email) || { email: email };
  return contactObject(contactData);
}

export function contactObject(contact) {
  const obj = {
    email: Array.isArray(contact.email)
      ? contact.email[0].address
      : contact.email,
  };
  if (contact.first_name) {
    obj.first_name = contact.first_name;
  }
  if (contact.last_name) {
    obj.last_name = contact.last_name;
  }
  return obj;
}
