[![Build Status](https://travis-ci.org/cloudsponge/address-book-connector.js.svg?branch=master)](https://travis-ci.org/cloudsponge/address-book-connector.js)

# Getting Started

This library depends on both CloudSponge and Zapier to connect a form on your web page with a Zapier workflow. You'll need to have an account with both services. You can access the [CloudSponge trigger in your Zapier account here]( https://zapier.com/developer/public-invite/29495/03f2709846a0dbe95b5347f6205fa49b/).

Add the library to your `package.json` with `yarn`

    yarn add @cloudsponge/address-book-connector.js

or `npm`:

    npm add @cloudsponge/address-book-connector.js

Use the `addressBookConnector` object and set your CloudSponge key (get it from your account at www.cloudsponge.com).

    import addressBookConnector from 'address-book-connector.js';
    addressBookConnector.setOptions({
        key: 'your-cloudsponge-key',
        // set your reply_to_email to make sure that recipients will be able to reply
        reply_to_email: 'support-inbox@yourdomain.com',
        // the default name to place into the reply-to of the email
        reply_to_name: 'Address Book Referrals'
    });

## Your form

The `addressBookConnector` is designed to be attached to a form on your page. Rather than submitting this form and its inputs, the `addressBookConnector` will serialize the form and submit its data to CloudSponge so that we can forward it on to the appropriate destinations.

Indicate the form that should be treated this way by decorating it with a data attribute called `data-addressBookConnector-js`.

### Special fields

Your form should include two special fields that will be sent to CloudSponge: contacts and owner. These fields should be named `contacts` and `owner`, with some exceptions. If you have an element with a class name of `cloudsponge-contacts`, it will be treated as the `contacts` field.

The contacts field can be a simple input or textarea that contains a comma separated list of email addresses. Even though the user only sees email addresses, we will also send the name and email address as structured data for each contact.

The owner field is similar. It will display an email address in the field and submit an object with the form data.

Strictly speaking, the owner field is optional. Owner and contacts may be hidden fields.

### Other data

Of course, your downstream destination probably needs some more information than just the owner and contacts. You may want to pass additional information, such as a referral code or some user input content to include in an email. Fear not. You can add this data and more by simply adding inputs to the form.

Any form data can be hidden fields, or it can be a user visible field. The choice is yours.

### Example

Here's a simple example form that includes some extra properties

    <form class="w-100" action="#" accept-charset="UTF-8" method="post" data-addressBookConnector-js>
        <input type="hidden" name="refUrl" value="http://localhost:8000/?ref_id=xyzabc000">
        <input type="hidden" name="owner" id="owner" value="">
        <div class="row">
            <div class="col-lg-8 col-md-12">
                <input type="text" name="email" id="email" value="" class="form-control cloudsponge-contacts mt-4" placeholder="To: (enter contact's email)" required="required" aria-describedby="#emailHelp">
                <small class="form-text text-muted" id="emailHelp">Separate multiple emails with commas.</small>
            </div>
            <div class="col">
                <button class="btn btn-primary cloudsponge-launch mt-4" href="" type="button">
                  <i class="fas fa-address-card mr-2"></i>
                  <span>Add From Contacts</span>
                </button>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-lg-8 col-md-12">
                <textarea name="body" id="body" class="form-control email-refer" rows="5">Hey, I highly recommend ...</textarea>
                <button id="send-invites" name="button" type="submit" class="btn btn-primary my-4"><i class="fas fa-paper-plane mr-2"></i>
                    <span>Send The Invite</span>
                </button>
            </div>
        </div>
    </form>

See a complete list of our examples at https://github.com/cloudsponge/address-book-connector-examples/.

When this form is submitted, CloudSponge will forward a payload like so:

    {
        "refUrl": "",
        "owner": {"first_name": "", "last_name": "", email: ""},
        "contacts": [{"first_name": "", "last_name": "", email: ""}, {"first_name": "", "last_name": "", email: ""}],
        "body": "Hey, I highly recommend ..."
    }

### Validations

At this time, we don't validate any of the data in the form. Your front-end code should perform any necessary validations before the form is submitted.

### Responses

When your form is submitted, data will be triggered on your webhook. The first step of that journey is to push the data to api.cloudsponge.com for authentication and forwarding to your destinations. This POST request may succeed or fail. To detect these cases, add a `success` and `failure` handler to your options.

* `success` - called when your form is accepted by CloudSponge.
* `failure` - called when your form is not accepted by CloudSponge. This function may accept a single `data` parameter that will indicate the reason for the failure. Typical reasons that the form may not be accepted is that the same data has been submitted recently, or the form has been submitted too many times recently. Both cases will respond with a 429 error code in the failure argument. For example:

        {status: 429, responseText: "Retry later", data: "Retry later"}

N.B. a successful response from CloudSponge does **not** confirm that the trigger has been forwarded to a destination such as Zapier.


## Optional

Integrate your CloudSponge Address Book Widget onto the page by adding a `cloudsponge-launch` element and a `cloudsponge-contacts` input/textarea.

Since this module includes your widget script, you should not include it elsewhere on your page.

To configure your Address Book Widget, pass options to the `cloudsponge` object by setting them in your call to `setOptions`:

    addressBookConnector.setOptions({
        key: 'your-cloudsponge-key',
        cloudspongeOptions: {
            // any cloudsponge options can be passed through here. For example,
            // sources: [],
            // locale: {},
        },
    });

**Remember, address-book-connector.js includes your CloudSponge Address Book Widget, so you should remove your widget script from your page/app.**

# Development

Pull requests are welcome. Fork this repo, make your changes, add/update tests and open a PR with a description of your work.



Install dependencies:

    yarn install

## Build

    yarn build

## Tests

Please add tests for your changes and ensure that all pass:

    yarn test

This small library boasts 100% code coverage. Don't take my word for it, check it yourself:

    yarn test:coverage

We also keep our code tidy with eslint. Run it to be sure that your code complies:

    yarn lint

Most lint errors can be automatically fixed with:

    yarn lint:fix


## Publishing

When changes are done and ready to be packaged into a new version of the module, run:

*       yarn build
    to ensure that the `dist` folder is up to date.
*       yarn version
    to set the new semver.
*       yarn publish
    to update the package with the latest version.
*       git push
    to keep git repo in synchronization with the project.

## Dependencies

`package.json` includes the following dev dependencies and rationale:

* compiling
  * @babel/core - babel compiler
  * @babel/preset-env - current standard babel preset
  * core-js - standard library polyfills for modern js
  * regenerator-runtime - supports `await` in our specs which depend on it to test the Promise response
* testing
  * jest - the one tool to test them all
* lint checking - tools and plugins to keep our code looking nice and consistent
  * eslint
  * eslint-config-prettier
  * eslint-plugin-prettier
  * eslint-plugin-jest
  * prettier
* building
  * rollup - build tool
  * rollup-plugin-node-resolve - resolves node_modules
  * rollup-plugin-commonjs - transforms `require` into something useful for UMD builds
  * rollup-plugin-babel - loads babel
  * rollup-plugin-copy - copies an html file to dist for testing
  * rollup-plugin-serve - a simple web server to manually test the lib locally
  * rollup-plugin-size-snapshot - captures build sizes
  * rollup-plugin-replace - env dependent replacements
  * rollup-plugin-strip - strips debugging statements from production builds
  * rollup-plugin-ugl - uglifier for prod
