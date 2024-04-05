/* Contact storage */
import options from './options';

// selected contacts are stored as JSON data within the DOM as 'data-' attributes. When the form is submitted,
// these attributes are merged with manually input data for submission to the cloudsponge.trigger function.

export function findContactData(list, email) {
  return list.find((c) => {
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
    const ownerName = `${obj.first_name} ${obj.last_name}`.trim();
    // create the from_name, reply_to_name and reply_to_email for the object
    // Sender name is the name of the owner of the address book, if available
    obj.sender_name = ownerName || options.defaultSenderName || '';
    if (options.senderEmail) {
      obj.sender_email = options.senderEmail;
    }
    // duplicate the sender_name field as from_name for other ESPs which use this name.
    obj.from_name = obj.sender_name;
    // reply to name is the same as the
    obj.reply_to_name =
      ownerName ||
      options.defaultReplyToName ||
      options.defaultSenderName ||
      '';
    // where should recipients reply to?
    obj.reply_to_email =
      options.replyToEmail || obj.email || options.defaultReplyToEmail || '';
    return obj;
  }

  // set the personalized fields
  if (opts.subject) {
    obj.subject = opts.subject.default || opts.subject;
    if (contact.first_name) {
      obj.personal_subject = `${contact.first_name} ${opts.subject}`.trim();
    } else {
      obj.personal_subject = opts.subject;
    }
  }
  obj.to = formatEmailAddr(obj);
  obj.greeting = `${options.greeting || 'Hi'} ${
    contact.first_name || options.greetingPlaceholder || ''
  }`.trim();

  return obj;
}

function formatEmailAddr(contact) {
  if (contact.first_name || contact.last_name) {
    const fullName = `${contact.first_name || ''} ${
      contact.last_name || ''
    }`.trim();
    return `${fullName} <${contact.email}>`.trim();
  }
  return contact.email;
}
