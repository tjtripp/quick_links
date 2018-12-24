/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* global chrome document */

/*! s
 * Saves options to chrome.storage
 * @param  {Array}   Serialized form data
 * @return {}
 */
function saveOptions(data) {
  const tabPref = data.find(element => element.name === 'tab-option');

  chrome.storage.sync.set({

    tabOption: tabPref.value,
    // entities:

  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
}

/*!
 * Restores select box and checkbox state using the preferences
 * stored in chrome.storage.
 * Might need to add checks for existense of objects
 */
function restoreOptions() {
  chrome.storage.sync.get({

    tabOption: 'new-tab', // this is a default in case there is no value in storage.

  }, (items) => {
    document.getElementById(items.tabOption).checked = true;
  });
}


/*!
 * Serialize all form data into an array
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
function serializeArray(form) {
  const serialized = [];

  for (let i = 0; i < form.elements.length; i++) {
    const field = form.elements[i];

    if (!field.name || field.disabled || field.type === 'file'
         || field.type === 'reset' || field.type === 'submit'
         || field.type === 'button') continue;

    if (field.type === 'select-multiple') {
      for (let n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) continue;
        serialized.push({
          name: field.name,
          value: field.options[n].value,
        });
      }
    } else if (field.id.includes('-label-input')) {
      // create key named  with label field.value;
      serialized.push({
        name: {},
      });
    } else if (field.id.includes('-url-input')) {
      // add value to previously added label value key
      serialized[field.name] = field.value;
    } else if ((field.type !== 'checkbox' && field.type !== 'radio')
      || field.checked) {
      serialized.push({
        name: field.name,
        value: field.value,
      });
    }
  }

  return serialized;
}

// Debugging:
// chrome.storage.onChanged.addListener(function(changes, namespace) {
//   for (key in changes) {
//     var storageChange = changes[key];
//     console.log('Storage key "%s" in namespace "%s" changed. ' +
//                 'Old value was "%s", new value is "%s".',
//                 key,
//                 namespace,
//                 storageChange.oldValue,
//                 storageChange.newValue);
//   }
// });

function urlComponent(name) {
  return `<div id="${name}-section" >`
            + `<label for="${name}-label-input" class="display-block" >Label for ${name}:</label>`
            + `<input id="${name}-label-input" name="${name}"`
              + 'class="border border-radius width-small height-small" type="text">'
            + `<label for="${name}-url-input" class="display-block" >URL for ${name}:</label>`
            + `<input id="${name}-url-input" name="${name}"`
              + 'class="border border-radius width-small height-small" type="text">'
          + '</div>';
}

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();


  const entitySection = document.querySelector('#entity-section');
  entitySection.innerHTML += urlComponent('Example');


  document.addEventListener('click', (event) => {
    if (!event.target.matches('#save-button')) return;

    event.preventDefault();

    const data = serializeArray(document.querySelector('#form-options'));
    saveOptions(data);
  });
});
