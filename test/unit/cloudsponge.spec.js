import options from '../../src/lib/options';
import { updateContactsField, updateOwnerField } from '../../src/lib/events';
import {
  form,
  ownerField,
  contactsField,
  serializeForm,
} from '../../src/lib/form';

// mock the form object
jest.mock('../../src/lib/form', () => ({
  form: jest.fn(),
  setData: jest.fn(),
  dataField: jest.fn(),
  ownerField: jest.fn(),
  contactsField: jest.fn(),
  serializeForm: jest.fn(),
}));

// mock the form() function
const formObj = {
  addEventListener: jest.fn(),
};

jest.spyOn(formObj, 'addEventListener').mockImplementation(() => {});

// try loading the test module after the mock have been set up
import {
  submitForm,
  cloudspongeLoaded,
  cloudspongeTrigger,
} from '../../src/lib/cloudsponge';

// console.log(window);
window.cloudsponge = {
  init: () => {},
  trigger: () => {},
};
// console.log(window.cloudsponge);

jest.spyOn(window.cloudsponge, 'init').mockImplementation(() => {});
jest.spyOn(window.cloudsponge, 'trigger').mockImplementation(() => {
  return new Promise(resolve => {
    resolve();
  });
});

beforeEach(() => {
  // the default value of form()
  form.mockImplementation(() => formObj);
  options.cloudspongeOptions = {};
});

describe('submitForm', () => {
  const event = {
    preventDefault: jest.fn(),
  };
  it('calls preventDefault on the given event', () => {
    submitForm(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
  it('does not call cloudsponge when no data is present', () => {
    submitForm(event);
    expect(window.cloudsponge.trigger).not.toHaveBeenCalled();
  });
  it('calls cloudsponge when the form has some data', () => {
    serializeForm.mockImplementation(() => ({}));
    submitForm(event);
    expect(window.cloudsponge.trigger).toHaveBeenCalledWith({});
  });
});

describe('cloudspongeLoaded', () => {
  it('calls cloudsponge.init with empty options', () => {
    delete options.cloudspongeOptions;
    cloudspongeLoaded();
    expect(cloudsponge.init).toHaveBeenCalledWith({});
  });
  it('calls cloudsponge.init with existing options', () => {
    options.cloudspongeOptions = { opt: 'a' };
    cloudspongeLoaded();
    expect(cloudsponge.init).toHaveBeenCalledWith({ opt: 'a' });
  });
  it('calls cloudsponge.init', () => {
    cloudspongeLoaded();
    expect(cloudsponge.init).toHaveBeenCalledWith({});
  });
  it('calls the form function', () => {
    cloudspongeLoaded();
    expect(form).toHaveBeenCalled();
  });
  it('attaches to the submit event of the form', () => {
    cloudspongeLoaded();
    expect(formObj.addEventListener).toHaveBeenCalled();
  });
  it('queries the form for the contacts field', () => {
    cloudspongeLoaded();
    expect(contactsField).toHaveBeenCalled();
  });
  it('adds a callback when it finds a contacts field', () => {
    contactsField.mockImplementation(() => {
      return {};
    });
    cloudspongeLoaded();
    expect(cloudsponge.init).toHaveBeenCalledWith({
      afterSubmitContacts: updateContactsField,
    });
  });
  it('queries the form for the owner field', () => {
    cloudspongeLoaded();
    expect(contactsField).toHaveBeenCalled();
  });
  it('adds a callback when it finds an owner field', () => {
    ownerField.mockImplementation(() => {
      return {};
    });
    cloudspongeLoaded();
    expect(contactsField).toHaveBeenCalled();
    expect(cloudsponge.init).toHaveBeenCalledWith({
      beforeDisplayContacts: updateOwnerField,
      afterSubmitContacts: updateContactsField,
    });
  });
  it('executes cloudsponge.init even if there is no form on the page', () => {
    form.mockImplementation(() => undefined);
    cloudspongeLoaded();
    expect(cloudsponge.init).toHaveBeenCalledWith({});
    expect(formObj.addEventListener).not.toHaveBeenCalled();
  });
});

describe('cloudspongeTrigger', () => {
  it('calls cloudsponge.trigger', () => {
    cloudspongeTrigger({});
    expect(cloudsponge.trigger).toHaveBeenCalled();
  });
  // test the options.success and options.failure callbacks
  it('invokes the success callback', async () => {
    options.success = jest.fn();
    options.failure = jest.fn();
    await cloudspongeTrigger({});
    expect(options.success).toHaveBeenCalled();
    expect(options.failure).not.toHaveBeenCalled();
  });
  it('invokes the failure callback', async () => {
    jest.spyOn(window.cloudsponge, 'trigger').mockImplementation(() => {
      return new Promise((resolve, fail) => {
        fail();
      });
    });
    options.success = jest.fn();
    options.failure = jest.fn();
    await cloudspongeTrigger({});
    expect(options.success).not.toHaveBeenCalled();
    expect(options.failure).toHaveBeenCalled();
  });
});
