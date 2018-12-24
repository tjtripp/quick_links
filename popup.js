/* eslint-disable prefer-destructuring */
/* global chrome window document */

const console = chrome.extension.getBackgroundPage().console;
const config = chrome.extension.getBackgroundPage().config;

const app = {

  entities: {},

  init() {
    this.entities = config.entities;
    // console.log("entities", config.entities);

    this.entityComponent = function entityComponent(name) {
      return `<div id="${name}-section" >`
              + `<label for="${name}-input " >${name}:</label>`
              + `<input id="${name}-input" name="${name}"`
                + 'class="border border-radius width-small height-small" type="text">'
              + `<button id="${name}-button" value="${name}" class="float-right">Go</button>`
            + '</div>';
    };
    this.mainpage = document.querySelector('#main'); // innerHTML(this.entityComponent());
    Object.keys(this.entities).forEach((key) => {
      // const value = this.entities[key];
      this.mainpage.innerHTML += this.entityComponent(key);
    });
  },

  openLink(element) {
    console.log('OpenLink Function : ', this.entities);

    const inputValue = element.value.trim();

    // check for blank input
    if (inputValue === '') {
      element.classList.add('border-red');
      element.classList.remove('border');
      return;
    }

    // build url
    const urlKey = element.name;
    const pageUrl = this.entities[urlKey] + inputValue;

    console.log('resourceType (Input Element name):', urlKey);
    console.log('inputValue (Input Element value):', inputValue);
    console.log('pageURL:', pageUrl);

    chrome.storage.sync.get({

      tabOption: 'new-tab', // this is a default in case there is no value in storage.

    }, (items) => {
      if (items.tabOption === 'current-tab') {
        // use existing tab
        chrome.tabs.update({
          url: pageUrl,
        });
      } else {
        // open new tab
        chrome.tabs.create({
          url: pageUrl,
        });
      }

      window.close();
    });
  },

};

// app start
document.addEventListener('DOMContentLoaded', () => {
  app.init();

  document.addEventListener('keyup', (event) => {
    // ignore enter key on non-input elements
    if (!event.target.matches('input')) return;

    if (event.key === 'Enter') {
      app.openLink(event.target);
    }
  }, false);

  document.addEventListener('click', (event) => {
    // ignore clicks on non-buttons
    if (!event.target.matches('button')) return;
    event.preventDefault();

    // get input element based on button value attribute
    const inputElement = document.getElementById(`${event.target.value}-input`);

    app.openLink(inputElement);
  }, false);
});
