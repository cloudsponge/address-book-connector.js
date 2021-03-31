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

## Best practices for email fields

If you are sending emails in response to the form triggering, it is important to map the fields from this form to your email integration with best practices in mind. Here are a few suggestions to maximize deliverability and email engagements. 

### Name your recipients

The `to` field should look like it is addressed directly to the recipient. This means formatting their email so that it includes their name. We do this for you and pass it through as the **To** value.

But be careful! Always test your Zap using a formatted `to` value to see if this causes any issue with your ESP. For example, Sendinblue does not like emails formatted this way. If your ESP won't accept the **To** field, use **Contact Email** instead.

### From or Sender

When we see an email in our inbox, the From Name is always displayed prominently. And so it's important to make sure that this information is as familiar looking as possible. Here's a few things to keep in mind. 

1. Use the inviters name as the **From Name** if possible. In cases where it is not available, have a reasonable default value.
2. Use an email address that has been verified for sending through your ESP as the **From Email**. This means that you may need to add SPF and DKIM entries as specified by your ESP. You can hardcode this value into your Zap, or you can set it in the default values.
3. Send from a verified email. Don't try to send from your customer's email address. Doing so will produce strange looking results in an email client. Instead, you can optionally use your customer's email in the Reply To field, so that recipients can reply to whoever sent the email directly rather than your organizational email.
4. Give recipients a logical place to reply. Depending on your needs, you may want recipients to reply directly to your organization. Or you may prefer them to reply directly to your customer. In either case, you'll want to make sure that the email address is defined. When using the CloudSponge Contact Picker, your customer's email is only available if they used the Contact Picker. That's why we support configuring a default value for the **Reply To Email** and **Reply To Name**.
5. Use an attention grabbing subject. There's nothing better than someone's name for grabbing their attention. Put it right into the subject line. We've made it easy for you by creating a **Personal Subject** value that already includes their first name (if it is available).
6. Greet them. Grab their attention in the first few words of the email. A personal greeting that includes their name is another great way to make your email stand out. Once again, we make this easy by adding a **Greeting** value which can be inserted ahead of your typical body text. Make sure to use proper punctuation as well.

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

### Setting default values

Since some fields are only available if a user uses the Contact Picker, it's important to set up reasonable default values. For example, when the user simply types an email address into the **To** field, we won't have the name associated with that recipient, no will we have the name or email address associated with the sender. It's important to think about how the email will appear in this situation. It won't have any of the personalizations that come from the Contact Picker. So we've exposed some default options for you to set. These can be set up either as HTML data attributes or they can be passed in to the call to `addressBookConnector.setOptions()`.

| Name | JS Option Name | HTML attribute | Meaning |
|------|----------------|----------------|---------|
| Sender email | senderEmail | data-sender-email | The verified email address of your ESP. |
| Sender name | defaultSenderName | data-default-sender-name | The name to supply for the sender, when none is present.|
| Reply-to email | defaultReplyToEmail | data-default-reply-to-email | The email to use when replying to your email. Users the Sender Email if not set. This value can be overridden by setting a value for `replyToEmail`. |
| Reply-to name | defaultReplyToName | data-default-reply-to-name | The name to use when replying to your email. Uses the sender name if not set. |
| Greeting | greeting | data-greeting | The greeting text to include with the recipient's name (if present). Defaults to 'Hi' |
| Greeting placeholder | greetingPlaceholder | data-greeting-placeholder | Text to use in the greeting in place of a missing recipient's first name. Defaults to an empty string. |

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

When this form is submitted, CloudSponge will forward a payload (for each email address) like so:

    {
        "refUrl": "",
        "owner_first_name": "",
        "owner_last_name": "",
        "owner_email": "",
        "contact_first_name": "",
        "contact_last_name": "",
        "contact_email": "",
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
