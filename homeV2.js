let selectedSpecialties = null;
let selectedInsurance = null;
let selectedState = null;

let locationInputs = document.querySelectorAll(".input-field");
let specialtyLabel = document.getElementById("specialties-label");
let insuranceLabel = document.getElementById("insurance-label");

const insuranceRadio = document.querySelectorAll('input[name="Insurance"]');

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
      closeSpecialty();
      closeInsurance();
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

insuranceRadio.forEach(function (radio) {
  radio.addEventListener("change", function () {
    const nextElement = this.nextElementSibling;
    selectedInsurance = nextElement.textContent;
    insuranceLabel.textContent = selectedInsurance;
    insuranceLabel.style.color = "#141529";
    createURL();
  });
});

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
      specialtyLabel.textContent = "Specialties";
      specialtyLabel.style.color = "#949494";
    }
    createURL();
  }
}

let finalURL = "/find?";

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
  const url = "https://www.faynutrition.com" + finalURL.toLowerCase();
}

//open and save dropdowns
var saveSpecialties = document.getElementById("save-specialty");
var specialtyTog = document.getElementById("specialty-tog");
var saveInsurance = document.getElementById("save-insurance");
var insuranceTog = document.getElementById("insurance-tog");
var insuranceDrop = document.getElementById("insurance-dropdown");
var specialtyDrop = document.getElementById("specialty-dropdown");

function toggleSpecialty() {
  document.getElementById("specialty-icon").classList.toggle("flipped");
  specialtyDrop.classList.toggle("open");
}

function toggleInsurance() {
  document.getElementById("insurance-icon").classList.toggle("flipped");
  insuranceDrop.classList.toggle("open");
}

function closeSpecialty() {
  document.getElementById("specialty-icon").classList.remove("flipped");
  specialtyDrop.classList.remove("open");
}

function closeInsurance() {
  document.getElementById("insurance-icon").classList.remove("flipped");
  insuranceDrop.classList.remove("open");
}

specialtyTog.addEventListener("click", toggleSpecialty);
specialtyTog.addEventListener("click", closeInsurance);
insuranceTog.addEventListener("click", toggleInsurance);
insuranceTog.addEventListener("click", closeSpecialty);
saveSpecialties.addEventListener("click", closeSpecialty);
saveInsurance.addEventListener("click", closeInsurance);

function handleClickOutside(event) {
  if (!form.contains(event.target)) {
    closeSpecialty();
    closeInsurance();
  }
}

//clear button
var clearSpecialties = document.getElementById("clear-specialties");
var clearSpecialtiesM = document.getElementById("clear-specialties-m");
var clearInsurance = document.getElementById("clear-insurance");
var clearInsuranceM = document.getElementById("clear-insurance-m");
var clearLocation = document.getElementById("clear-location-m");

function clearCheckboxes() {
  var checkboxes = document.getElementsByClassName("specialty");
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  selectedSpecialties = null;
  specialtyLabel.textContent = "Specialties";
  specialtyLabel.style.color = "#949494";
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
clearInsuranceM.addEventListener("click", clearRadios);
clearLocation.addEventListener("click", clearInput);

//match zip code inputs
const input1 = document.getElementById("inputText1");
const input2 = document.getElementById("inputTextMobile");

input1.addEventListener("input", function () {
  input2.value = input1.value;
});

input2.addEventListener("input", function () {
  input1.value = input2.value;
});

//prevent enter from submitting form
const form = document.getElementById("hero-form");
const mobileForm = document.getElementById("location-form");

form.addEventListener("keypress", function preventSubmit() {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});

mobileForm.addEventListener("keypress", function preventSubmit() {
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

function storeInputText() {
  closeSpecialty();
  closeInsurance();
  document.getElementById("loading-div").style.display = "block";
  const inputText = input1.value;
  sessionStorage.setItem("inputText", inputText);
  window.location.href = finalURL.toLowerCase();
}

document.addEventListener("click", function (event) {
  handleClickOutside(event);
});

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    document.getElementById("loading-div").style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loading-div").style.display = "none";
  initAutocomplete();
  var checkboxes = document.getElementsByClassName("specialty");
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", handleCheckboxChange);
  }
});
