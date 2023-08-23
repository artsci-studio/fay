let selectedInsurance = null;
let selectedState = null;
let selectedSpecialties = null;

let locationInputs = document.querySelectorAll(".input-field");
let insuranceLabel = document.getElementById("insurance-label");
let specialtyLabel = document.getElementById("specialties-label");

const insuranceRadio = document.querySelectorAll('input[name="Insurance"]');

//alerts
let heroAlert = document.getElementById("hero-alert");
let insuranceAlert = document.getElementById("insurance-alert");
let stateAlert = document.getElementById("state-alert");
let andAlert = document.getElementById("alert-and");

let finalURL = "/find?";

//autocomplete
var autocompleteTimer;
var requestCounter = 0;

function initAutocomplete() {
  var options = {
    types: ["(regions)"],
    componentRestrictions: { country: "us" }
  };
  locationInputs.forEach((locationInput) => {
    var autocomplete = new google.maps.places.Autocomplete(
      locationInput,
      options
    );

    locationInput.addEventListener("input", function () {
      clearTimeout(autocompleteTimer);
      var input = locationInput.value;
      if (input === "") {
        selectedState = null;
        createURL();
      }
      autocompleteTimer = setTimeout(function () {
        if (input.trim() !== "") {
          autocomplete.getPlace();
          requestCounter++; // Increment the counter
          console.log("calls:", requestCounter);
        }
      }, 500);

      if (input.trim() === "") {
        return;
      }
    });
    autocomplete.addListener("place_changed", function () {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        console.log("error");
        return;
      }
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
      selectedState = state;
      var event = new Event("input", { bubbles: true });
      locationInput.dispatchEvent(event);
      createURL();
    });
  });
}

//handle insurance change
insuranceRadio.forEach(function (radio) {
  radio.addEventListener("change", function () {
    const nextElement = this.nextElementSibling;
    selectedInsurance = nextElement.textContent;
    console.log(selectedInsurance);
    insuranceLabel.textContent = selectedInsurance;
    insuranceLabel.style.color = "#141529";
    createURL();
  });
});

//Handle specialties change
function handleCheckboxChange() {
  var checkboxes = document.getElementsByClassName("specialty");
  selectedSpecialties = "";
  var selectedValues = [];
  var textBox = "";
  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    var label = checkbox.parentNode.textContent.trim();
    if (checkbox.checked) {
      if (label === "Eating Disorders & Disordered Eating") {
        label = "Eating Disorders";
      } else if (label === "Food Allergies & Sensitivities") {
        label = "Food Allergies";
      } else if (label === "Vegan & Vegetarian") {
        label = "Vegan Vegetarian";
      }

      selectedValues.push(label);
      textBox += label;
      selectedSpecialties +=
        label
          .replace(/\s+/g, "-")
          .replace(/[^\w\s-]/g, "")
          .toLowerCase() + "%7C";
    } else {
      var index = selectedValues.indexOf(checkbox.value);
      if (index !== -1) {
        selectedValues.splice(index, 1);
      }
      var commaSeparatedList = selectedValues.join(", ");
      specialtyLabel.textContent = commaSeparatedList;
      specialtyLabel.style.color = "#141529";
    }
    if (selectedSpecialties === "") {
      specialtyLabel.textContent = "Choose specialties";
      specialtyLabel.style.color = "#757575";
    }
    createURL();
  }
}

//clear specialties
var clearSpecialties = document.getElementById("clear-specialties");
var clearSpecialtiesM = document.getElementById("clear-specialties-m");
var clearInsurance = document.getElementById("clear-insurance");
var clearLocation = document.getElementById("clear-location-m");

//save specialties
$("#save-specialty").on("click", function () {
  $(".w-dropdown").trigger("w-close");
});

//save specialties
$("#save-insurance").on("click", function () {
  $(".w-dropdown").trigger("w-close");
});

function clearCheckboxes() {
  var checkboxes = document.getElementsByClassName("specialty");
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  selectedSpecialties = null;
  specialtyLabel.textContent = "Choose specialties";
  specialtyLabel.style.color = "#757575";
  setTimeout(() => {
    createURL();
  }, 200);
}

function clearRadios() {
  console.log("clear");
  for (var i = 0; i < insuranceRadio.length; i++) {
    insuranceRadio[i].checked = false;
  }
  selectedInsurance = null;
  insuranceLabel.textContent = "Insurance";
  insuranceLabel.style.color = "#949494";
  createURL();
}

function clearInput() {
  input2.value = "";
  input1.value = "";
  var event = new Event("input", { bubbles: true });
  input2.dispatchEvent(event);
  selectedState = null;
  createURL();
}

// Add a click event listener to the button
clearSpecialties.addEventListener("click", clearCheckboxes);
clearSpecialtiesM.addEventListener("click", clearCheckboxes);
clearInsurance.addEventListener("click", clearRadios);
clearLocation.addEventListener("click", clearInput);

//create Find URL
function createURL() {
  finalURL = "/find?";
  let stateURL;
  let insuranceURL;
  let specialtyURL;
  if (selectedState != null) {
    stateURL = selectedState.replace(/\s+/g, "-").replace(/[^\w\s-]/g, "");
    finalURL = finalURL.concat("&states=", stateURL);
  }
  if (selectedInsurance != null) {
    insuranceURL = selectedInsurance
      .replace(/\s+/g, "-")
      .replace(/[^\w\s-]/g, "");
    finalURL = finalURL.concat("&insurance=", insuranceURL);
  }
  if (selectedSpecialties != null) {
    specialtyURL = selectedSpecialties;
    finalURL = finalURL.concat("&specialties=", specialtyURL);
  }
  console.log("state: " + selectedState + " insurance: " + selectedInsurance);
  const url = "https://www.faynutrition.com" + finalURL.toLowerCase();
  console.log(url);
}

//prevent enter from submitting form
const form = document.getElementById("filter-form");

form.addEventListener("keypress", function preventSubmit() {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

//prevent scroll when popup is open
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

//match zip code inputs
const input1 = document.getElementById("inputText1");
const input2 = document.getElementById("inputTextMobile");

input1.addEventListener("input", function () {
  input2.value = input1.value;
});

input2.addEventListener("input", function () {
  input1.value = input2.value;
});

function storeInputText() {
  if (selectedInsurance == null || selectedState == null) {
    heroAlert.style.display = "block";
    if (selectedInsurance == null && selectedState != null) {
      console.log("no insurance");
      insuranceAlert.style.display = "inline-block";
      stateAlert.style.display = "none";
      andAlert.style.display = "none";
    } else if (selectedInsurance != null && selectedState == null) {
      console.log("no state");
      stateAlert.style.display = "inline-block";
      insuranceAlert.style.display = "none";
      andAlert.style.display = "none";
    } else if (selectedInsurance == null && selectedState == null) {
      console.log("no insurance or state");
      stateAlert.style.display = "inline-block";
      insuranceAlert.style.display = "inline-block";
      andAlert.style.display = "inline-block";
    }
  } else {
    heroAlert.style.display = "none";
    document.getElementById("loading-div").style.display = "block";
    const inputText = input1.value;
    sessionStorage.setItem("inputText", inputText);
    window.location.href = finalURL.toLowerCase();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initAutocomplete();
  document.getElementById("loading-div").style.display = "none";
  var checkboxes = document.getElementsByClassName("specialty");
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", handleCheckboxChange);
  }
});
