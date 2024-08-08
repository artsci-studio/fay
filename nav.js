let menuWrap = $(".mobile-menu");
let menuPanels = $(".menu-panel");
let contentMore = $(".content-more");
let contentSub = $(".content-sub");
let menuButton = $(".nav-btn");
let menuLines = $(".nav-line");
let backFirst = $(".go-back");
let backSecond = $(".back-sub");
let previouslyFocused;
let active;

let showSubMenu = gsap.timeline({
paused: true,
onComplete: () => {
  active.find("a, button").first().focus();
},
onReverseComplete: () => {
  previouslyFocused.focus();
}
});
showSubMenu.to(menuPanels, {
x: "-100%",
ease: "power2.inOut",
duration: 0.4
});

let showSubSubMenu = gsap.timeline({
paused: true,
onComplete: () => {
  active.find("a, button").first().focus();
},
onReverseComplete: () => {
  backFirst.focus();
}
});
showSubSubMenu.to(
menuPanels, { x: "-200%" });

let showMainMenu = gsap.timeline({
paused: true,
defaults: { duration: 0.3 },
onReverseComplete: () => {
  showSubSubMenu.progress(0);
  showSubSubMenu.pause();
  showSubMenu.progress(0);
  showSubMenu.pause();
},
onComplete: () => {
  menuWrap.find("a").first().focus();
}

});

showMainMenu.set(menuWrap, { display: "flex" });
showMainMenu.set($("body"), { overflow: "hidden" });
showMainMenu.from(menuWrap, { x: "100%" });
showMainMenu.to(menuLines.eq(0), { y: 8, rotate: 45 }, "<");
showMainMenu.to(menuLines.eq(1), { width: "0px" }, "<");
showMainMenu.to(menuLines.eq(2), { y: -8, rotate: -45 }, "<");

menuButton.on("click", function () {
if (showMainMenu.progress() === 0) {
  showMainMenu.play();
} else {
  showMainMenu.reverse();
}
});

$(".opens-more").on("click", function () {
previouslyFocused = $(this);
let linkIndex = $(this).index();
linkIndex = linkIndex - 2;
console.log(linkIndex);
showSubMenu.play();
contentMore.hide();
active = contentMore.eq(linkIndex).show();
});

backFirst.on("click", function () {
showSubMenu.reverse();
});

$(".opens-sub").on("click", function () {
let linkIndex = $(this).index();
showSubSubMenu.play();
contentSub.hide();
active = contentSub.eq(linkIndex).show();
});

backSecond.on("click", function () {
showSubSubMenu.reverse();
});

$("[trap-focus]").each(function () {
let focusBack = $(this).attr("focus-back");
let lastItem = $(this).find("a, button").last();
lastItem.on("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault();
    if (focusBack === "first") {
      backFirst.focus();
    }
    else if (focusBack === "second") {
      backSecond.focus();
    } else {
      menuButton.focus();
    }

  }
})
})

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const allParams = [];
    for (const [key, value] of params.entries()) {
        allParams.push([key, value]);
    }
    return allParams;
}

// Function to set UTM parameters in session storage
function setUtmParams(params) {
    for (const [key, value] of params) {
        if (key.startsWith('utm_') || ['ad_id', 'adset_id', 'placement', 'site_source_name', 'fbclid'].includes(key)) {
            sessionStorage.setItem(key, value);
        }
    }
}

// Function to get UTM parameters from session storage
function getStoredUtmParams() {
    const utmParams = [];
    for (const key in sessionStorage) {
        if (key.startsWith('utm_') || ['ad_id', 'adset_id', 'placement', 'site_source_name', 'fbclid'].includes(key)) {
            utmParams.push([key, sessionStorage.getItem(key)]);
        }
    }
    return utmParams;
}

// Function to append UTM parameters to links
function appendUtmParamsToLinks(params) {
    if (params.length > 0) {
        document.querySelectorAll('a').forEach(link => {
            try {
                const url = new URL(link.href, window.location.origin);
                const existingParams = new URLSearchParams(url.search);

                // Only append parameters if they don't already exist in the URL
                for (const [key, value] of params) {
                    if (!existingParams.has(key)) {
                        existingParams.set(key, value);
                    }
                }

                url.search = existingParams.toString();
                link.href = url.toString();
            } catch (e) {
                console.error('Invalid URL:', link.href, e);
            }
        });
    }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    const currentParams = getUrlParams();
    if (currentParams.length > 0) {
        setUtmParams(currentParams);
    }
    const storedParams = getStoredUtmParams();
    appendUtmParamsToLinks(storedParams);
});
