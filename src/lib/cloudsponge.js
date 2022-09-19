// here's where we wire up the events, after the cloudsponge object has loaded on the page
import options from './options';
import { form, ownerField, contactsField, serializeForm } from './form';
import { updateContactsField, updateOwnerField } from './events';

// serializes the form and passes the data to the cloudsponge object for triggering
const submitForm = e => {
  // don't post the form, let cloudsponge handle everything
  e.preventDefault();

  // include any manually added contacts with the form payload
  // this is important in case the user added or removed any email addresses manually
  updateContactsField([]);

  // serialize the form inputs for submission
  const data = serializeForm();
  if (data) {
    cloudspongeTrigger(data);
  }
};

const cloudspongeLoaded = () => {
  const cloudspongeOpts = options.cloudspongeOptions || {};
  const formElement = form();
  if (formElement) {
    // if there is a field for owner data
    if (ownerField()) {
      cloudspongeOpts.beforeDisplayContacts = updateOwnerField;
    }

    if (contactsField()) {
      cloudspongeOpts.afterSubmitContacts = updateContactsField;
    }

    formElement.addEventListener('submit', submitForm);
  }
  cloudspongeInit(cloudspongeOpts);
};

const cloudspongeInit = opts => {
  window.cloudsponge && cloudsponge.init(opts);
};

const cloudspongeTrigger = data => {
  return window.cloudsponge
    .trigger(data)
    .then(() => {
      console.log(
        '[address-book-connector.js] Successfully triggered cloudsponge with data:',
        data
      );
      // invoke a callback on the addressBookConnector object
      options.success && options.success(data);
    })
    .catch(error => {
      console.error(
        '[address-book-connector.js] Failed to trigger cloudsponge:',
        error
      );
      // invoke a callback on the addressBookConnector object
      options.failure && options.failure(error, data);
    });
};

export { submitForm, cloudspongeLoaded, cloudspongeTrigger };
