// import window from 'window';
const document = window.document;

import options from './lib/options';
import { thisScript, addScript } from './lib/script';
import { isObj, isStr } from './lib/utils';
import { updateOwnerField } from './lib/events';
import { submitForm } from './lib/cloudsponge';

// public function that assigns a key and initializes the cloudsponge object
// key: required - your CloudSponge key, get one from your account at www.cloudsponge.com
// success: optional - a callback to be invoked after the form submits successfully sending the contacts to cloudsponge
// failure: optional - a callback to be invoked after the form submits and an error occurs
const setOptions = opts => {
  Object.assign(options, opts);

  if (opts.key) {
    // load the external cloudsponge script onto the page
    addScript(opts);
  }

  // options may have affected the owner field, so let's update it
  updateOwnerField();
};

const initialize = () => {
  // check and initialize this script if the data includes the cloudsponge key
  if (
    isObj(thisScript) &&
    isObj(thisScript.dataset) &&
    isStr(thisScript.dataset.key)
  ) {
    setOptions(thisScript.dataset);
  }
};

// do the initialization now
initialize();

// the addressBookConnector object wraps the cloudsponge object and accepts options from the host page
const addressBookConnector = {
  initialize,
  setOptions,
  submitForm,
};

export default addressBookConnector;
