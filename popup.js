"use strict";

var console = chrome.extension.getBackgroundPage().console;
var config = chrome.extension.getBackgroundPage().config;

var app = {

  entities: {},
  
  init: function() {
    
    this.entities = config.entities;
    //console.log("entities", config.entities);
   
    this.entityComponent = function(name, url) {
     return '<div id="'+ name +'-section" >' +
              '<label for="'+ name +'-input " >'+ name +':</label>' +
              '<input id="'+ name +'-input" name="'+ name + '"' +
                'class="border border-radius width-small height-small" type="text">' +
              '<button id="'+ name +'-button" value="'+ name +'" class="float-right">Go</button>' +
            '</div>';
    }
    this.mainpage = document.querySelector("#main"); // innerHTML(this.entityComponent());      
    Object.keys(this.entities).forEach(key => {
      var value = this.entities[key];
      this.mainpage.innerHTML += this.entityComponent(key, value);
    });
  },

  openLink: function(element) {
    console.log("OpenLink Function : ",this.entities);

    var inputValue = element.value.trim();
        
    // check for blank input
    if (inputValue === "") {
      element.classList.add("border-red");
      element.classList.remove("border");
      return;  
    }

    // build url  
    var urlKey = element.name;
    var pageUrl = this.entities[urlKey] + inputValue;
    
    console.log("resourceType (Input Element name):", urlKey);
    console.log("inputValue (Input Element value):", inputValue);
    console.log("pageURL:", pageUrl);
    
    chrome.storage.sync.get({
  
      tabOption: "new-tab"  // this is a default in case there is no value in storage.
    
    }, function(items) {
      
      if (items["tabOption"] === "current-tab") {
  
        // use existing tab
        chrome.tabs.update({
          url: pageUrl
        });
  
      } else {
  
        // open new tab
        chrome.tabs.create({
          url: pageUrl
        });
  
      }
  
      window.close();
  
    });
    return;
  },

};

// app start
document.addEventListener("DOMContentLoaded", function() {

  app.init();
  
  document.addEventListener("keyup", function (event) {
  
    //ignore enter key on non-input elements
    if (!event.target.matches("input")) return;
  
    if (event.key === "Enter") {
      app.openLink(event.target);
    }
  }, false);
  
  document.addEventListener("click", function (event) {
    
    //ignore clicks on non-buttons
    if (!event.target.matches("button")) return;
    event.preventDefault();
    
    // get input element based on button value attribute
    var inputElement = document.getElementById(event.target.value+"-input");
  
    app.openLink(inputElement);
    
  }, false);

});
