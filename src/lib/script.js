import { cloudspongeScriptId } from './consts';
import { cloudspongeLoaded } from './cloudsponge';

const findScript = () =>
  document.currentScript ||
  document.querySelector(
    'script[data-id=cloudsponge-sharer],script[src*="sharer.js"]'
  ) ||
  {};

const thisScript = findScript();

// adds the CloudSponge Address Book Widget script exactly once to the page.
const script = (src, cb) => {
  if (!document.querySelector(`script#${cloudspongeScriptId}`)) {
    const scriptTag = document.createElement('script');
    scriptTag.id = cloudspongeScriptId;
    scriptTag.src = src;
    scriptTag.onload = cb;
    thisScript.parentElement.appendChild(scriptTag);
  } else {
    // the script is on the page already, re-initialize the cloudsponge object to pick up any changes
    cb && cb();
  }
};

// returns the proper name of the cloudsponge script to be added to the page
const csScriptSrc = opts => {
  return `http${opts.insecure ? '' : 's'}://${opts.host ||
    'api.cloudsponge.com'}/widget/${opts.key}.js`;
};

const addScript = opts => {
  if (opts.key) {
    script(csScriptSrc(opts), cloudspongeLoaded);
  }
};

export { findScript, thisScript, csScriptSrc, addScript, script };
