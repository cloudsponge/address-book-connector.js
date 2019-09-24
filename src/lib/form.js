/* form.js
 * Accessors for the standard DOM object on the page.
 */

import { namespace, jsonDataKey, contactsFieldClassName } from './consts';

// returns the form that the addressBookConnector is active on
const form = () => {
  return document.querySelector(`[data-${namespace}-js]`);
};

// returns the input fireld that stores the owner data
const ownerField = () => {
  const formElement = form();
  return (
    formElement &&
    formElement.querySelector(`[name=owner],[data-${namespace}-name=owner]`)
  );
};

// returns the input fireld that stores the contacts data
const contactsField = () => {
  const formElement = form();
  return (
    formElement &&
    formElement.querySelector(
      `.cloudsponge-contacts,[data-${namespace}-name=contacts]`
    )
  );
};

// get the stored data from the element from either the dataset or from the value of the input
const getData = (element, defaultValue = []) => {
  if (element.dataset && element.dataset[jsonDataKey]) {
    // this element holds structure data so read it from the dataset
    return JSON.parse(element.dataset[jsonDataKey]);
  } else {
    // this is a normal input element so just return its value
    return defaultValue;
  }
};

// sets the structured data inside the form field
const setData = (element, data) => {
  if (element) {
    element.dataset[jsonDataKey] = JSON.stringify(data);
  }
};

// identifies a field as the special field for "contacts"
const isContactField = input => {
  const contactsFieldClassNameMatcher = new RegExp(
    `\\b${contactsFieldClassName}\\b`
  );
  return !!(
    input.className && input.className.match(contactsFieldClassNameMatcher)
  );
};

// gets the appropriate key name for a given input by:
//   first checking if the input is the special field for "contacts",
//   then returning the 'data-addressBookConnector-name' attribute,
//   then returning the name attribute
//   then returning the id attribute
const inputKey = input => {
  if (isContactField(input)) {
    return 'contacts';
  } else {
    return (
      (input.dataset && input.dataset[`${namespace}Name`]) ||
      input['name'] ||
      input.id
    );
  }
};

// serializes a form's input fields into a data structure
const serializeForm = () => {
  const formElement = form();
  if (formElement) {
    const data = {};
    formElement.querySelectorAll('input,textarea,select').forEach(input => {
      data[inputKey(input)] = getData(input, input.value);
    });
    return data;
  } else {
    return null;
  }
};

// export all functions for testing
export {
  form,
  ownerField,
  contactsField,
  getData,
  setData,
  serializeForm,
  inputKey,
  isContactField,
};
