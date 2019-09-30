//!minOnSave
/**
 *  SpongeBob Formatter
 *  APP JS
 */

if ( "serviceWorker" in navigator ) {
  navigator.serviceWorker.register("sw.js")
    .then(reg => console.log("Service Worker registered!", reg))
    .catch(err => console.warn("Service Worker registration failed!", err))
} else {
  console.warn("Your browser does not support PWA!");
}

let input = document.getElementById('input-textarea');
let formats = document.querySelectorAll('.format-button-input');
let actions = document.querySelectorAll('.action-button');
let copy = document.getElementById('action-button-copy');
let share = document.getElementById('action-button-share');
let messenger = document.getElementById('input-message');
let normal = "";

/**
 *  Move Floater
 */

const floaterMove = (button) => {
  let left = button.parentNode.offsetLeft;
  let top = button.parentNode.offsetTop;
  document.querySelector(".format-floater").style.left = left + "px";
  document.querySelector(".format-floater").style.top = top + "px";
}

/**
 *  Enable format buttons if there's input
 */

const formatsEnable = (reveal = true) => {
  if ( reveal ) {
     formats[1].disabled = false;
    formats[2].disabled = false;
  } else {
    formats[1].disabled = true;
    formats[2].disabled = true;
  }
}

/**
 *  Enable action buttons if there's input
 */

const actionsEnable = (reveal = true) => {
  if ( reveal ) {
     actions[0].disabled = false;
    actions[1].disabled = false;
  } else {
    actions[0].disabled = true;
    actions[1].disabled = true;
  }
}

/**
 *  Invoke Message
 */

const messageInvoke = (message) => {
  messenger.innerText = message;
  new Promise (resolve => {
    setTimeout(() => { /// Keep message static for a while
      messenger.classList.add("fadeOut");
      resolve();
    }, 3000);
  }).then(() => {
    setTimeout(() => { /// Animate Out
      messenger.innerText = "";
      messenger.classList.remove("fadeOut");
    }, 3000);
  })
}

/**
 *  Formatting the text
 */

const formatText = (format) => {
  let array = [...input.value.toLowerCase()];
  let formatted;
  input.readOnly = true;
  switch (format) {
    case "1":
      formatted = array.map((e,i) => {
        if ( i % 2 == 0 ) return e.toUpperCase()
        return e;
      })
      input.value = formatted.join("");
      break;
    case "2":
      formatted = array.map((e,i) => {
        if ( i % 2 != 0 ) return e.toUpperCase()
        return e;
      })
      input.value = formatted.join("");
      break;
    case "0":
    default:
      formatted = array;
      input.readOnly = false;
      input.value = normal;
  }
}

/**
 *  Copy Text
 */

const actionCopy = () => {
  input.select();
  input.setSelectionRange(0, 99999); /*For mobile devices*/
  document.execCommand("copy");
  messageInvoke("Message copied!");
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}

/**
 *  Share Text
 */
/// reveals Share button is Web Share API is enabled.
if (navigator.share) {
  share.hidden = false;
}

const actionShare = () => {
  if (navigator.share) {
    navigator.share({
      // title: 'Web Fundamentals',
      text: input.value,
      // url: 'https://developers.google.com/web',
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.warn('Error sharing', error));
  }
}


/**
 *  Events Listeners
 */

input.addEventListener("keyup", ev => {
  normal = ev.target.value;
  formatsEnable(ev.target.value.length);
  actionsEnable(ev.target.value.length);
})

for ( let format of formats ) {
  format.addEventListener("click", ev => {
    formatText(ev.target.value);
    floaterMove(ev.target);
  });
}

copy.addEventListener("click", ev => {
  console.log("copied");
  actionCopy();
})

share.addEventListener("click", ev => {
  console.log("sharing");
  actionShare();
})

/**
 *  Render BG decorations
 */

const bgRenderDeco = () => {
  let bg = document.querySelector(".deco-container");

  fetch("./images/bg-deco.svg")
  .then(resp => resp.text())
  .then(deco => {
    for (var i = 0; i < 7; i++) {
      bg.innerHTML += deco;
    }
  }).then(() => {
    bg.querySelectorAll("svg").forEach(deco => {
      let x = bg.clientWidth * Math.random();
      let y = bg.clientHeight * Math.random();
      let r = Math.round(Math.random() * 10);
      let s = Math.random() - 0.6;
      deco.style.left = x + "px";
      deco.style.top = y + "px";
      deco.style.transform = `translate(-50%, -50%) rotate(${r}deg) scale(${s})`;
    })
  })
}
bgRenderDeco();
