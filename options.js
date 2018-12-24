
/*!s
 * Saves options to chrome.storage
 * @param  {Array}   Serialized form data
 * @return {}      
 */
function saveOptions(data) {
  console.log("options: ", JSON.stringify(data));
  var tabPref = data.find(function (element) {
    return element.name === "tab-option";
  });
  

  chrome.storage.sync.set({
  
    tabOption: tabPref.value
    // entities: 
  
  }, function() {
    
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(function() {
      status.textContent = "";
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

    tabOption: "new-tab"  // this is a default in case there is no value in storage.
  
  }, function(items) {
  
    document.getElementById(items["tabOption"]).checked = true;
  
  });

};


/*!
 * Serialize all form data into an array
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
var serializeArray = function (form) {
  var serialized = [];

  for (var i = 0; i < form.elements.length; i++) {
    var field = form.elements[i];

    if (!field.name || field.disabled || field.type === "file" ||
         field.type === "reset" || field.type === "submit" || 
         field.type === "button") continue;
    
    if (field.type === "select-multiple") {
      for (var n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) continue;
        serialized.push({
          name: field.name,
          value: field.options[n].value
        });
      }
    }
    else if (field.id.includes("-label-input")) {
        // create key named  with label field.value;
        serialized.push({
          name: {}
        })
      }
    else if (field.id.includes("-url-input")) {
        // add value to previously added label value key
        serialized[field.name] = field.value;
    }
    else if ((field.type !== "checkbox" && field.type !== "radio") ||
      field.checked) {
      serialized.push({
        name: field.name,
        value: field.value
      });
    }
  }

  return serialized;

};

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

var urlComponent = function(name) {
  return  '<div id="'+ name +'-section" >' +
            '<label for="'+ name +'-label-input" class="display-block" >Label for '+ name +':</label>' +
            '<input id="'+ name +'-label-input" name="'+ name + '"' +
              'class="border border-radius width-small height-small" type="text">' +
            '<label for="'+ name +'-url-input" class="display-block" >URL for '+ name +':</label>' +
            '<input id="'+ name +'-url-input" name="'+ name + '"' +
              'class="border border-radius width-small height-small" type="text">' +
          '</div>';
 }

document.addEventListener("DOMContentLoaded", function() {
  restoreOptions();



  entitySection = document.querySelector('#entity-section');
  entitySection.innerHTML += urlComponent('Example');



  document.addEventListener("click", function (event) {
    
    if (!event.target.matches("#save-button")) return;
    
    event.preventDefault();
    
    data = serializeArray(document.querySelector("#form-options"));
    saveOptions(data);
    
  });


});



