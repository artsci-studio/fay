//all
const countElementAll = document.querySelector("#filter-count");

// specialties
const countS = document.querySelector("#count-specialties");
const Scheckboxes = document.querySelectorAll(".checkbox-filter-s");

//modalities
const countM = document.querySelector("#count-modalities");
const Mcheckboxes = document.querySelectorAll(".checkbox-filter-m");

//clear all
const clearAll = document.querySelector(".jetboost-list-wrapper-empty-b977");

//show total count for modalities and specialties on mobile
function updateCountAll() {
  const linkBlockS = countS.querySelectorAll(".filter-applied");
  const linkBlockM = countM.querySelectorAll(".filter-applied");
  const count = linkBlockS.length - 1 + (linkBlockM.length - 1);
  countElementAll.textContent = "(" + count + ")";
  if (count === 0) {
    countElementAll.style.display = "none";
  } else {
    countElementAll.style.display = "block";
  }
}

function delayedCountAll() {
  setTimeout(updateCountAll, 300);
}

Scheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", updateCountAll);
});

Mcheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", updateCountAll);
});

document
  .querySelector("#clear-filters")
  .addEventListener("click", delayedCountAll);

window.onload = function () {
  updateCountAll();
};

//dont scroll the website when a popup is open

Webflow.push(function () {
  $(".popup-trigger").click(function (e) {
    e.preventDefault();
    $("body").css("overflow", "hidden");
  });
  $(".close").click(function (e) {
    e.preventDefault();
    $("body").css("overflow", "auto");
  });
});

const zipCodeInputs = document.querySelectorAll(".zip-input");
const stateCheckboxes = document.getElementsByClassName("state-checkbox");

// Select the list element
let stateFilterWrap = document.querySelector(".count-state");

// Create a new MutationObserver
let observer = new MutationObserver(function (mutations) {
  // Loop through each mutation
  mutations.forEach(function (mutation) {
    // Check if the list has only one item
    if (stateFilterWrap.children.length === 1) {
      // Trigger your action here
      zipCodeInputs.forEach(function (input) {
        input.value = "";
      });
    }
  });
});

// Configure the observer to watch for changes to the list
let config = { childList: true };

// Start observing the list
observer.observe(stateFilterWrap, config);

//prevent form from submitting on enter
// Get the button and input elements
const form = document.getElementById("filter-form");
const formBar = document.getElementById("filter-form-bar");
const mobileForm = document.getElementById("loction-form");

form.addEventListener("keypress", function preventSubmit() {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission
  }
});

mobileForm.addEventListener("keypress", function preventSubmit() {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission
  }
});

formBar.addEventListener("keypress", function preventSubmit() {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission
  }
});

//match zip code inputs
const input1 = document.getElementById("zipCodeInput1");
const input2 = document.getElementById("zipCodeInput2");
const input3 = document.getElementById("zipCodeInput3");

input1.addEventListener("input", function () {
  input2.value = input1.value;
  input3.value = input1.value;
});

input2.addEventListener("input", function () {
  input1.value = input2.value;
  input3.value = input2.value;
});

input3.addEventListener("input", function () {
  input1.value = input3.value;
  input2.value = input3.value;
});

//Google Autocomplete
var autocompleteTimer; // Variable to hold the timer ID
var requestCounter = 0;

function initAutocomplete() {
  var options = {
    types: ["(regions)"],
    componentRestrictions: { country: "us" } // Restrict results to the United States
  };
  zipCodeInputs.forEach((zipCodeInput) => {
    var autocomplete = new google.maps.places.Autocomplete(
      zipCodeInput,
      options
    );

    zipCodeInput.addEventListener("input", function () {
      clearTimeout(autocompleteTimer); // Clear the previous timer
      var input = zipCodeInput.value;

      // Set a new timer to delay the request
      autocompleteTimer = setTimeout(function () {
        if (input.trim() !== "") {
          // Perform the autocomplete request
          autocomplete.getPlace();
          requestCounter++; // Increment the counter
          console.log("Number of Requests: ", requestCounter);
        }
      }, 500); // Adjust the delay time (in milliseconds) as needed

      if (input.trim() === "") {
        console.log("empty");
        let stateFilter = document.querySelectorAll(
          ".filter-applied.jetboost-applied-filter-item-b977.static.st-filter.w-inline-block"
        );
        for (let i = 0; i < stateFilter.length; i++) {
          stateFilter[i].click();
        }
        return;
      }
    });
    autocomplete.addListener("place_changed", function () {
      console.log("place changed");
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // Invalid place selected
        console.log("error");
        return;
      }

      // Retrieve the selected zip code, city, and state
      var zipCode = "";
      var city = "";
      var state = "";

      for (var i = 0; i < place.address_components.length; i++) {
        var component = place.address_components[i];
        if (component.types.includes("postal_code")) {
          zipCode = component.long_name;
        }
        if (component.types.includes("locality")) {
          city = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          if (city === "Washington, D.C.") {
            state = "District of Columbia";
          } else {
            state = component.long_name;
          }
        }
      }

      if (state !== null) {
        // Loop through the checkboxes to find a match and check it
        for (let i = 0; i < stateCheckboxes.length; i++) {
          const labelSpan = stateCheckboxes[i].nextElementSibling;
          if (labelSpan.textContent === state) {
            stateCheckboxes[i].checked = true;
            stateCheckboxes[i].click();
            break; // Exit the loop once a match is found
          }
        }
      }

      console.log("Selected State:", state);
      // Trigger the input event
      var event = new Event("input", { bubbles: true });
      zipCodeInput.dispatchEvent(event);
    });
  });
}

function clearInput() {
  input3.value = "";
  input2.value = "";
  input1.value = "";
  var event = new Event("input", { bubbles: true });
  input3.dispatchEvent(event);
}

let clearLocation = document.getElementById("clear-filter-location");
clearLocation.addEventListener("click", function () {
  clearInput();
});

clearAll.addEventListener("click", function () {
  clearInput();
  updateCountAll();
});

// Open and save dropdowns
var togElements = document.getElementsByClassName("navbar_filter-toggle");
var dropdownElements = document.getElementsByClassName("hero_dropdown-wrap");
var saveElements = document.getElementsByClassName("save");

function toggleDropdown(event) {
  var clickedDropdown = event.currentTarget.nextElementSibling;

  // Close other dropdowns
  for (var i = 0; i < dropdownElements.length; i++) {
    if (dropdownElements[i] !== clickedDropdown) {
      dropdownElements[i].classList.remove("open");
      clickedDropdown.setAttribute('aria-expanded', "false");
    }
  }

  // Toggle clicked dropdown
  clickedDropdown.classList.toggle("open");
  clickedDropdown.setAttribute('aria-expanded', "true");
}

function closeDropdown(event) {
  var dropdown = event.currentTarget.closest(".hero_dropdown-wrap");
  dropdown.classList.remove("open");
  dropdown.setAttribute('aria-expanded', "false");
}

function closeDropdownsOutsideForm(event) {
  var clickedElement = event.target;
  var isDropdownClicked = clickedElement.closest(".filter-wrapper") !== null;

  if (!isDropdownClicked) {
    for (var i = 0; i < dropdownElements.length; i++) {
      dropdownElements[i].classList.remove("open");
      dropdownElements[i].setAttribute('aria-expanded', "false");
    }
  }
}

// Attach event listeners to toggle elements
for (var i = 0; i < togElements.length; i++) {
  togElements[i].addEventListener("click", toggleDropdown);
}

// Attach event listeners to save elements
for (var i = 0; i < saveElements.length; i++) {
  saveElements[i].addEventListener("click", closeDropdown);
}

document.addEventListener("click", closeDropdownsOutsideForm);
input1.addEventListener("click", closeDropdownsOutsideForm);
input2.addEventListener("click", closeDropdownsOutsideForm);

//Disable distnce radios when Video only is selected in modal
var typeRadios = document.querySelectorAll('input[name="type"]');
var distanceRadios = document.querySelectorAll('input[name="distance"]');
var clear = document.querySelectorAll(".clear-more-filters");
var clearDriving = document.querySelector("#clear-driving");

function handleTypeChange(distanceRadios) {
  var typeRadio = document.querySelector('input[name="type"]:checked');

  if (typeRadio && typeRadio.value === "video-only") {
    clearDriving.click();
    distanceRadios.forEach(function (radio) {
      radio.disabled = true;
      radio.checked = false; // Deselect all radio buttons in "Distance" group
    });
  } else {
    distanceRadios.forEach(function (radio) {
      radio.disabled = false;
    });
  }
}
//var distanceLabels = document.querySelectorAll('.distance-label');

typeRadios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    handleTypeChange(distanceRadios);
  });
});
clear.forEach(function (button) {
  button.addEventListener("click", function () {
    clearDriving.click();
    distanceRadios.forEach(function (radio) {
      radio.disabled = false;
    });
  });
});

//on load

document.addEventListener("DOMContentLoaded", function () {
  initAutocomplete();
  delayedCountAll();
  var inputText = sessionStorage.getItem("inputText");
  console.log(inputText);
  if (inputText !== null && inputText !== undefined) {
    // Populate the input with the stored value from homepage
    input1.value = inputText;
  } else {
    // Populate with state value if set
    var urlParams = new URLSearchParams(window.location.search);
    var urlValue = urlParams.get("states");
    if (urlValue) {
      urlValue = urlValue.replace(/-/g, " ");
      urlValue = urlValue.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
      });
      input1.value = urlValue;
    }
  }
  var event = new Event("input", { bubbles: true });
  input1.dispatchEvent(event);
  sessionStorage.removeItem("inputText");
  console.log(inputText);
  console.log("loaded");
});
