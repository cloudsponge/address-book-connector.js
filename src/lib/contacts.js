/* Contact storage */
import options from './options';

// selected contacts are stored as JSON data within the DOM as 'data-' attributes. When the form is submitted,
// these attributes are merged with manually input data for submission to the cloudsponge.trigger function.

export function findContactData(list, email) {
  return list.find(c => {
    return c.email == email || c.__selectedMail__ == email;
  });
}

export function getContact(list1, list2, email, opts) {
  const contactData = findContactData(list1, email) ||
    findContactData(list2, email) || { email: email };
  return contactObject(contactData, opts);
}

// the contact object contains
export function contactObject(contact, opts = {}) {
  contact ||= {};

  const obj = {
    email: Array.isArray(contact.email)
      ? contact.email[0].address
      : contact.email,
  };
  obj.first_name = contact.first_name || '';
  obj.last_name = contact.last_name || '';

  if (opts.owner) {
    // create the from name, reply_to_name and reply_to_email for the object
    obj.from_name = `${obj.first_name} ${obj.last_name}`.trim();
    obj.reply_to_name = options.reply_to_name || obj.from_name;
    obj.reply_to_email = options.reply_to_email || obj.email || '';
    return obj;
  }

  // set the personalized fields
  if (opts.subject) {
    if (contact.first_name) {
      obj.personalSubject = `${contact.first_name} ${opts.subject}`;
    } else {
      obj.personalSubject = opts.subject;
    }
  }
  obj.to = formatEmailAddr(contact);
  obj.greeting = `Hi ${contact.first_name || 'there'}`;

  return obj;
}

function formatEmailAddr(contact) {
  if (contact.first_name || contact.last_name) {
    return `${contact.first_name || ''} ${contact.last_name || ''} <${
      contact.email
    }>`.trim();
  }
  return contact.email;
}
