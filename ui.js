var notesRemaining = 50;
var context;

var phone = {};
phone.actualWidth = 1663;
phone.actualHeight = 3857;
phone.element = document.getElementById('phone');

var screen = {};
screen.element = document.getElementById('screen');
screen.actualLeft = 304;
screen.actualTop = 950;
screen.actualWidth = 1350 - screen.actualLeft;
screen.actualHeight = 1722 - screen.actualTop;
screen.pixelWidth = 96;
screen.pixelHeight = 65;

var buttons = [];

var power = {};
power.element = document.getElementById('power');
power.actualLeft = 220;
power.actualTop = 1936;
power.actualWidth = 627 - power.actualLeft;
power.actualHeight = 2194 - power.actualTop;
buttons.push(power);

var soft = {};
soft.element = document.getElementById('soft');
soft.actualLeft = 616;
soft.actualTop = 1964;
soft.actualWidth = 1012 - soft.actualLeft;
soft.actualHeight = 2530 - soft.actualTop;
soft.element.addEventListener(
  'mousedown',
  function() {
    playSong();
  },
  false
);
buttons.push(soft);

var up = {};
up.element = document.getElementById('up');
up.actualLeft = 1045;
up.actualTop = 1964;
up.actualWidth = 1402 - up.actualLeft;
up.actualHeight = 2194 - up.actualTop;
buttons.push(up);

var clear = {};
clear.element = document.getElementById('clear');
clear.actualLeft = 204;
clear.actualTop = 2222;
clear.actualWidth = 600 - clear.actualLeft;
clear.actualHeight = 2475 - clear.actualTop;
clear.element.addEventListener(
  'mousedown',
  function() {
    if (notesRemaining < 50) {
      notesRemaining += 1;
      renderScreen();
    }
    clear.heldAction = window.setTimeout(
      function() {
        notesRemaining = 50;
        renderScreen();
      },
      500
    );
  },
  false
);
clear.element.addEventListener(
  'mouseup',
  function() {
    window.clearTimeout(clear.heldAction);
  },
  false
);
buttons.push(clear);

var down = {};
down.element = document.getElementById('down');
down.actualLeft = 1034;
down.actualTop = 2233;
down.actualWidth = 1436 - down.actualLeft;
down.actualHeight = 2486 - down.actualTop;
buttons.push(down);

var one = {};
one.element = document.getElementById('one');
one.actualLeft = 187;
one.actualTop = 2519;
one.actualWidth = 572 - one.actualLeft;
one.actualHeight = 2766 - one.actualTop;
one.element.addEventListener(
  'mousedown',
  function() {
    if (notesRemaining > 0) {
      notesRemaining -= 1;
      renderScreen();
    }
  },
  false
);
buttons.push(one);

var two = {};
two.element = document.getElementById('two');
two.actualLeft = 622;
two.actualTop = 2552;
two.actualWidth = 1012 - two.actualLeft;
two.actualHeight = 2810 - two.actualTop;
two.action = function() {
  notesRemaining -= 1;
};
buttons.push(two);

var three = {};
three.element = document.getElementById('three');
three.actualLeft = 1067;
three.actualTop = 2530;
three.actualWidth = 1452 - three.actualLeft;
three.actualHeight = 2794 - three.actualTop;
three.action = function() {
  notesRemaining -= 1;
};
buttons.push(three);

var four = {};
four.element = document.getElementById('four');
four.actualLeft = 187;
four.actualTop = 2800;
four.actualWidth = 572 - four.actualLeft;
four.actualHeight = 3058 - four.actualTop;
four.action = function() {
  notesRemaining -= 1;
};
buttons.push(four);

var five = {};
five.element = document.getElementById('five');
five.actualLeft = 616;
five.actualTop = 2822;
five.actualWidth = 1001 - five.actualLeft;
five.actualHeight = 3080 - five.actualTop;
five.action = function() {
  notesRemaining -= 1;
};
buttons.push(five);

var six = {};
six.element = document.getElementById('six');
six.actualLeft = 1067;
six.actualTop = 2805;
six.actualWidth = 1446 - six.actualLeft;
six.actualHeight = 3064 - six.actualTop;
six.action = function() {
  notesRemaining -= 1;
};
buttons.push(six);

var seven = {};
seven.element = document.getElementById('seven');
seven.actualLeft = 204;
seven.actualTop = 3069;
seven.actualWidth = 572 - seven.actualLeft;
seven.actualHeight = 3316 - seven.actualTop;
seven.action = function() {
  notesRemaining -= 1;
};
buttons.push(seven);

var eight = {};
eight.element = document.getElementById('eight');
eight.actualLeft = 616;
eight.actualTop = 3096;
eight.actualWidth = 996 - eight.actualLeft;
eight.actualHeight = 3350 - eight.actualTop;
eight.action = function() {
  notesRemaining -= 1;
};
buttons.push(eight);

var nine = {};
nine.element = document.getElementById('nine');
nine.actualLeft = 1056;
nine.actualTop = 3074;
nine.actualWidth = 1441 - nine.actualLeft;
nine.actualHeight = 3322 - nine.actualTop;
nine.action = function() {
  notesRemaining -= 1;
};
buttons.push(nine);

var asterisk = {};
asterisk.element = document.getElementById('asterisk');
asterisk.actualLeft = 187;
asterisk.actualTop = 3322;
asterisk.actualWidth = 572 - asterisk.actualLeft;
asterisk.actualHeight = 3575 - asterisk.actualTop;
buttons.push(asterisk);

var zero = {};
zero.element = document.getElementById('zero');
zero.actualLeft = 616;
zero.actualTop = 3344;
zero.actualWidth = 1001 - zero.actualLeft;
zero.actualHeight = 3597 - zero.actualTop;
buttons.push(zero);

var hash = {};
hash.element = document.getElementById('hash');
hash.actualLeft = 1056;
hash.actualTop = 3328;
hash.actualWidth = 1436 - hash.actualLeft;
hash.actualHeight = 3586 - hash.actualTop;
buttons.push(hash);

var cursor = {};
cursor.position = 0;
cursor.isBlinkedOn = true;
cursor.octave = '4';
cursor.duration = '1';

var pixel = {};
pixel.width = 9;
pixel.height = 11;
pixel.horizonalSpace = 3;
pixel.verticalSpace = 2;


function initScreen() {
  context = screen.element.getContext("2d");
  context.clearRect(0, 0, screen.element.width, screen.element.height);
  context.fillStyle = "rgb(0, 0, 0)";
  context.shadowColor = "rgba(0, 0, 0, 0.25)";
  context.shadowBlur = 6;
  context.shadowOffsetX = -6;
  context.shadowOffsetY = 4;

  blinkCursor();
}

function blinkCursor() {
  cursor.isBlinkedOn = !cursor.isBlinkedOn;
  window.setTimeout(blinkCursor, 500);
}

function renderScreen() {
  context.clearRect(0, 0, screen.element.width, screen.element.height);
  context.fillStyle = "rgb(0, 0, 0)";
  context.shadowColor = "rgba(0, 0, 0, 0.25)";
  context.shadowBlur = 6;
  context.shadowOffsetX = -6;
  context.shadowOffsetY = 4;

  renderBitmap(context, 1, 0, composerNotesBitmap);
  displayCursor(context);
  displayNotesRemaining(context);
  displaySoftButton(context, "Play");

  window.setTimeout(renderScreen, 500);
}

function displaySoftButton(context, name) {
  var width = 0;
  for (var i = 0; i < name.length; i++) {
    width += composerFont[name.charAt(i)].width;
  }
  var destX = Math.floor(screen.pixelWidth / 2) - Math.floor(width / 2);
  var destY = screen.pixelHeight - composer_y.height;

  for (var i = 0; i < name.length; i++) {
    var bitmap = composerFont[name.charAt(i)];
    renderBitmap(context, destX, destY, bitmap);
    destX += bitmap.width;
  }
}

function displayCursor(context) {
  var rowHeight = composerNotesBitmap.height + 6;
  var cursorX = 0;
  var cursorY = 1 + cursor.position % 4;
  if (cursor.isBlinkedOn) {
    renderBitmap(context, cursorX, cursorY * rowHeight, composer_Cursor);
  }
}

function displayNotesRemaining(context) {
  var ones = notesRemaining % 10;
  var tens = Math.floor(notesRemaining / 10);

  // Note: The notesRemaining bitmap font is fixed-width.
  var notesRemainingStart = screen.pixelWidth - notesRemaining_0.width * 2;

  // Render tens place.
  renderNotesRemainingDigit(context, notesRemainingStart, 0, tens);

  // Render ones place.
  renderNotesRemainingDigit(
    context,
    notesRemainingStart + notesRemaining_0.width,
    0,
    ones
  );
}

function renderNotesRemainingDigit(context, destX, destY, digit) {
  if (digit === 0) {
    renderBitmap(context, destX, destY, notesRemaining_0);
  } else if (digit === 1) {
    renderBitmap(context, destX, destY, notesRemaining_1);
  } else if (digit === 2) {
    renderBitmap(context, destX, destY, notesRemaining_2);
  } else if (digit === 3) {
    renderBitmap(context, destX, destY, notesRemaining_3);
  } else if (digit === 4) {
    renderBitmap(context, destX, destY, notesRemaining_4);
  } else if (digit === 5) {
    renderBitmap(context, destX, destY, notesRemaining_5);
  } else if (digit === 6) {
    renderBitmap(context, destX, destY, notesRemaining_6);
  } else if (digit === 7) {
    renderBitmap(context, destX, destY, notesRemaining_7);
  } else if (digit === 8) {
    renderBitmap(context, destX, destY, notesRemaining_8);
  } else if (digit === 9) {
    renderBitmap(context, destX, destY, notesRemaining_9);
  }
}

function renderBitmap(context, destX, destY, bitmap) {
  for (var i = 0; i < bitmap.width; i++) {
    for (var j = 0; j < bitmap.height; j++) {
      if (bitmap.bitmap[j * bitmap.width + i] == 1) {
        context.fillRect(
          (destX + i) * pixel.horizonalSpace + (destX + i) * pixel.width,
          (destY + j) * pixel.verticalSpace + (destY + j) * pixel.height,
          pixel.width,
          pixel.height
        );
      }
    }
  }
}

function displayButtons() {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].element.style.display = "inherit";
  }
}

function resizePhone() {
  // Calculate for Phone
  var actualRatio = phone.actualWidth / phone.actualHeight;
  var windowRatio = window.innerWidth / window.innerHeight;
  if (windowRatio > actualRatio) {
    // Window is wider than actual phone.
    phone.height = window.innerHeight;
    phone.width = phone.height / phone.actualHeight * phone.actualWidth;
  } else {
    // Window is not wider than actual phone.
    phone.width = window.innerWidth;
    phone.height = phone.width / phone.actualWidth * phone.actualHeight;
  }
  phone.left = window.innerWidth / 2 - phone.width / 2;
  phone.top = window.innerHeight / 2 - phone.height / 2;
  // Apply
  phone.element.width = phone.width;
  phone.element.height = phone.height;
  phone.element.style.left = phone.left + "px";
  phone.element.style.top = phone.top + "px";

  for (var i = 0; i < buttons.length; i++) {
    resizePhoneElement(buttons[i], phone);
  }
  resizePhoneElement(screen, phone);
}

function resizePhoneElement(phoneElement, phone)
{
  var ratioX = phone.width / phone.actualWidth;
  var ratioY = phone.height / phone.actualHeight;
  phoneElement.left = phoneElement.actualLeft * ratioX + phone.left;
  phoneElement.top = phoneElement.actualTop * ratioY + phone.top;
  phoneElement.width = phoneElement.actualWidth * ratioX;
  phoneElement.height = phoneElement.actualHeight * ratioY;

  // Apply
  phoneElement.element.style.left = phoneElement.left + "px";
  phoneElement.element.style.top = phoneElement.top + "px";
  phoneElement.element.style.width = phoneElement.width + "px";
  phoneElement.element.style.height = phoneElement.height + "px";
}

