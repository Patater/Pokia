var autoscale = true;
var notesRemaining = 50;
var context;
var composerSong = new Song();
composerSong.tempo = 112; // Default Nokia Composer tempo

var phone = {};
phone.actualWidth = 1663;
phone.actualHeight = 3857;
phone.backgroundElement = document.getElementById('phone-screen');
phone.screenShadowElement = document.getElementById('phone-shadowscreen');
phone.foregroundElement = document.getElementById('phone-body');
phone.previousDesiredImageHeight = 1;

var lcd = {};
lcd.element = document.getElementById('lcd');
lcd.actualLeft = 240;
lcd.actualTop = 880;
lcd.actualWidth = 1420 - lcd.actualLeft;
lcd.actualHeight = 1800 - lcd.actualTop;
lcd.visibleLeft = 304;
lcd.visibleTop = 950;
lcd.visibleWidth = 1376 - lcd.visibleLeft;
lcd.visibleHeight = 1802 - lcd.visibleTop;
lcd.pixelWidth = 96;
lcd.pixelHeight = 65;
lcd.on = true;

var buttons = [];

var power = {};
power.element = document.getElementById('power');
power.imageElement = document.getElementById('power-img');
power.actualLeft = 220;
power.actualTop = 1936;
power.actualWidth = 627 - power.actualLeft;
power.actualHeight = 2194 - power.actualTop;
power.element.addEventListener(
  'mousedown',
  function() {
    pressButton(power);
    if (lcd.on) {
      turnOnBacklight();
      startBlinkingCursor();
    }

    power.heldAction = window.setTimeout(
      function () {
        lcd.on = !lcd.on;
        if (lcd.on === false) {
          // Phone turned off, so turn off sound, too.
          composerSong.stop();
          turnOffBacklight();
        } else {
          // Start with a fresh state.
          turnOnBacklight();
          startBlinkingCursor();
          composerSong.notes = [];
          updateNotesRemaining();
          cursor.position = 0;
          cursor.updateFromPreviousNote();
        }
        renderLCD();
      },
      500
    );

    renderLCD();
  },
  false
);
power.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(power);
    window.clearTimeout(power.heldAction);
  },
  false
);
buttons.push(power);

var soft = {};
soft.element = document.getElementById('soft');
soft.imageElement = document.getElementById('soft-img');
soft.actualLeft = 616;
soft.actualTop = 1964;
soft.actualWidth = 1012 - soft.actualLeft;
soft.actualHeight = 2530 - soft.actualTop;
soft.element.addEventListener(
  'mousedown',
  function() {
    pressButton(soft);
    if (!lcd.on) {
      return;
    }
    var now = audioContext.currentTime;
    composerSong.play(now);
    turnOnBacklight();
    startBlinkingCursor();
    renderLCD();
  },
  false
);
soft.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(soft);
  },
  false
);
buttons.push(soft);

var up = {};
up.element = document.getElementById('up');
up.imageElement = document.getElementById('up-img');
up.actualLeft = 1045;
up.actualTop = 1964;
up.actualWidth = 1402 - up.actualLeft;
up.actualHeight = 2194 - up.actualTop;
up.element.addEventListener(
  'mousedown',
  function() {
    pressButton(up);
    if (!lcd.on) {
      return;
    }
    turnOnBacklight();
    startBlinkingCursor();

    moveCursorUp();

    var moveCursorUpAgain = function() {
      moveCursorUp();
      renderLCD();
      up.heldAction = window.setTimeout(moveCursorUpAgain, 150);
    }
    up.heldAction = window.setTimeout(moveCursorUpAgain, 500);

    renderLCD();
  },
  false
);
up.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(up);
    window.clearTimeout(up.heldAction);
  },
  false
);
buttons.push(up);

var clear = {};
clear.element = document.getElementById('clear');
clear.imageElement = document.getElementById('clear-img');
clear.actualLeft = 204;
clear.actualTop = 2222;
clear.actualWidth = 600 - clear.actualLeft;
clear.actualHeight = 2475 - clear.actualTop;
clear.element.addEventListener(
  'mousedown',
  function() {
    pressButton(clear);
    if (!lcd.on) {
      return;
    }

    // Cancel any currently scheduled notes.
    composerSong.stop();

    turnOnBacklight();
    startBlinkingCursor();

    if (notesRemaining < 50) {
      if (cursor.position > 0) {
        composerSong.notes.splice(cursor.position - 1, 1);
        composerSong.notes[cursor.position - 1];
        updateNotesRemaining();
        cursor.position -= 1;
      }
      cursor.updateFromPreviousNote();
    }
    clear.heldAction = window.setTimeout(
      function() {
        composerSong.notes = [];
        updateNotesRemaining();
        cursor.position = 0;
        cursor.updateFromPreviousNote();
        renderLCD();
      },
      500
    );

    renderLCD();
  },
  false
);
clear.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(clear);
    window.clearTimeout(clear.heldAction);
  },
  false
);
buttons.push(clear);

var down = {};
down.element = document.getElementById('down');
down.imageElement = document.getElementById('down-img');
down.actualLeft = 1034;
down.actualTop = 2233;
down.actualWidth = 1436 - down.actualLeft;
down.actualHeight = 2486 - down.actualTop;
down.element.addEventListener(
  'mousedown',
  function() {
    pressButton(down);
    if (!lcd.on) {
      return;
    }
    turnOnBacklight();
    startBlinkingCursor();

    moveCursorDown();

    var moveCursorDownAgain = function() {
      moveCursorDown();
      renderLCD();
      down.heldAction = window.setTimeout(moveCursorDownAgain, 150);
    }
    down.heldAction = window.setTimeout(moveCursorDownAgain, 500);

    renderLCD();
  },
  false
);
down.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(down);
    window.clearTimeout(down.heldAction);
  },
  false
);
buttons.push(down);

var one = {};
one.element = document.getElementById('one');
one.imageElement = document.getElementById('one-img');
one.actualLeft = 187;
one.actualTop = 2519;
one.actualWidth = 572 - one.actualLeft;
one.actualHeight = 2766 - one.actualTop;
registerNoteButton('c', one);
buttons.push(one);

var two = {};
two.element = document.getElementById('two');
two.imageElement = document.getElementById('two-img');
two.actualLeft = 622;
two.actualTop = 2552;
two.actualWidth = 1012 - two.actualLeft;
two.actualHeight = 2810 - two.actualTop;
registerNoteButton('d', two);
buttons.push(two);

var three = {};
three.element = document.getElementById('three');
three.imageElement = document.getElementById('three-img');
three.actualLeft = 1067;
three.actualTop = 2530;
three.actualWidth = 1452 - three.actualLeft;
three.actualHeight = 2794 - three.actualTop;
registerNoteButton('e', three);
buttons.push(three);

var four = {};
four.element = document.getElementById('four');
four.imageElement = document.getElementById('four-img');
four.actualLeft = 187;
four.actualTop = 2800;
four.actualWidth = 572 - four.actualLeft;
four.actualHeight = 3058 - four.actualTop;
registerNoteButton('f', four);
buttons.push(four);

var five = {};
five.element = document.getElementById('five');
five.imageElement = document.getElementById('five-img');
five.actualLeft = 616;
five.actualTop = 2822;
five.actualWidth = 1001 - five.actualLeft;
five.actualHeight = 3080 - five.actualTop;
registerNoteButton('g', five);
buttons.push(five);

var six = {};
six.element = document.getElementById('six');
six.imageElement = document.getElementById('six-img');
six.actualLeft = 1067;
six.actualTop = 2805;
six.actualWidth = 1446 - six.actualLeft;
six.actualHeight = 3064 - six.actualTop;
registerNoteButton('a', six);
buttons.push(six);

var seven = {};
seven.element = document.getElementById('seven');
seven.imageElement = document.getElementById('seven-img');
seven.actualLeft = 204;
seven.actualTop = 3069;
seven.actualWidth = 572 - seven.actualLeft;
seven.actualHeight = 3316 - seven.actualTop;
registerNoteButton('b', seven);
buttons.push(seven);

var eight = {};
eight.element = document.getElementById('eight');
eight.imageElement = document.getElementById('eight-img');
eight.actualLeft = 616;
eight.actualTop = 3096;
eight.actualWidth = 996 - eight.actualLeft;
eight.actualHeight = 3350 - eight.actualTop;
eight.element.addEventListener(
  'mousedown',
  function() {
    pressButton(eight);
    if (!lcd.on) {
      return;
    }
    turnOnBacklight();
    startBlinkingCursor();

    var note = composerSong.notes[cursor.position - 1];
    if (note) {
      note.duration *= 2;
      if (note.duration > 32) {
        note.duration = 1;
      }

      // Only change the cursor duration if we are on a note, not a rest.
      if (!note.pause) {
        cursor.duration = note.duration;
        composerSong.stop();
        var now = audioContext.currentTime;
        composerSong.playNote(note, now);
      }
    }

    renderLCD();
  },
  false
);
eight.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(eight);
  },
  false
);
buttons.push(eight);

var nine = {};
nine.element = document.getElementById('nine');
nine.imageElement = document.getElementById('nine-img');
nine.actualLeft = 1056;
nine.actualTop = 3074;
nine.actualWidth = 1441 - nine.actualLeft;
nine.actualHeight = 3322 - nine.actualTop;
nine.element.addEventListener(
  'mousedown',
  function() {
    pressButton(nine);
    if (!lcd.on) {
      return;
    }
    turnOnBacklight();
    startBlinkingCursor();

    var note = composerSong.notes[cursor.position - 1];
    if (note) {
      note.duration /= 2;
      if (note.duration < 1) {
        note.duration = 32;
      }

      // Only change the cursor duration if we are on a note, not a rest.
      if (!note.pause) {
        cursor.duration = note.duration;
        composerSong.stop();
        var now = audioContext.currentTime;
        composerSong.playNote(note, now);
      }
    }

    renderLCD();
  },
  false
);
nine.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(nine);
  },
  false
);
buttons.push(nine);

var asterisk = {};
asterisk.element = document.getElementById('asterisk');
asterisk.imageElement = document.getElementById('asterisk-img');
asterisk.actualLeft = 187;
asterisk.actualTop = 3322;
asterisk.actualWidth = 572 - asterisk.actualLeft;
asterisk.actualHeight = 3575 - asterisk.actualTop;
asterisk.element.addEventListener(
  'mousedown',
  function() {
    pressButton(asterisk);
    if (!lcd.on) {
      return;
    }
    turnOnBacklight();
    startBlinkingCursor();

    var note = composerSong.notes[cursor.position - 1];
    if (note) {
      var octave = note.getComposerOctave();
      octave = octave % 3 + 1;
      cursor.composerOctave = octave;
      note.setComposerNote(note.note, octave);
      composerSong.stop();
      var now = audioContext.currentTime;
      composerSong.playNote(note, now);
    }

    renderLCD();
  },
  false
);
asterisk.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(asterisk);
  },
  false
);
buttons.push(asterisk);

var zero = {};
zero.element = document.getElementById('zero');
zero.imageElement = document.getElementById('zero-img');
zero.actualLeft = 616;
zero.actualTop = 3344;
zero.actualWidth = 1001 - zero.actualLeft;
zero.actualHeight = 3597 - zero.actualTop;
zero.element.addEventListener(
  'mousedown',
  function() {
    pressButton(zero);
    if (!lcd.on) {
      return;
    }
    turnOnBacklight();
    startBlinkingCursor();

    if (notesRemaining > 0) {
      var note = new Note();
      note.pause = true;
      note.duration = cursor.duration;
      composerSong.notes.splice(cursor.position, 0, note);
      updateNotesRemaining();
      cursor.position += 1;

    }

    renderLCD();
  },
  false
);
zero.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(zero);
  },
  false
);
buttons.push(zero);

var hash = {};
hash.element = document.getElementById('hash');
hash.imageElement = document.getElementById('hash-img');
hash.actualLeft = 1056;
hash.actualTop = 3328;
hash.actualWidth = 1436 - hash.actualLeft;
hash.actualHeight = 3586 - hash.actualTop;
hash.element.addEventListener(
  'mousedown',
  function() {
    pressButton(hash);
    if (!lcd.on) {
      return;
    }
    turnOnBacklight();
    startBlinkingCursor();

    var note = composerSong.notes[cursor.position - 1];
    if (note) {
      var prevNote = note.note;
      note.toggleSharp();
      if (prevNote !== note.note) {
        composerSong.stop();
        var now = audioContext.currentTime;
        composerSong.playNote(note, now);
      }
    }

    renderLCD();
  },
  false
);
hash.element.addEventListener(
  'mouseup',
  function() {
    unpressButton(hash);
  },
  false
);
buttons.push(hash);

var Cursor = function() {
  this.position = 0;
  this.isBlinkedOn = true;
  this.composerOctave = 1;
  this.duration = 4;
  this.destX = 0;
  this.line = 0;
}
Cursor.prototype.updateFromPreviousNote = function() {
  var cursorNote = composerSong.notes[this.position - 1];
  if (cursorNote) {
    this.composerOctave = cursorNote.getComposerOctave();
    this.duration = cursorNote.duration;
  } else {
    this.composerOctave = 1;
    this.duration = 4;
  }
}
var cursor = new Cursor();

var pixel = {};
pixel.width = 9;
pixel.height = 11;
pixel.horizonalSpace = 3;
pixel.verticalSpace = 2;

function registerNoteButton(note, button) {
  button.element.addEventListener(
    'mousedown',
    function() {
      return enterNote(note, button);
    },
    false
  );
  button.element.addEventListener(
    'mouseup',
    function() {
      unpressButton(button);
      window.clearTimeout(button.heldAction);
    },
    false
  );
}

function enterNote(whichNote, button) {
  pressButton(button);
  if (!lcd.on) {
    return;
  }
  turnOnBacklight();
  startBlinkingCursor();

  if (notesRemaining > 0) {
    cursor.updateFromPreviousNote();
    var note = new Note();
    note.duration = cursor.duration;
    note.setComposerNote(whichNote, cursor.composerOctave);
    composerSong.stop();
    var now = audioContext.currentTime;
    composerSong.playNote(note, now);
    composerSong.notes.splice(cursor.position, 0, note);
    updateNotesRemaining();
    cursor.position += 1;

    button.heldAction = window.setTimeout(
      function() {
        var note = composerSong.notes[cursor.position - 1];
        note.toggleDot();
        composerSong.stop();
        var now = audioContext.currentTime;
        composerSong.playNote(note, now);
        renderLCD();
      },
      500
    );
  }

  renderLCD();
}

function initLCD() {
  context = lcd.element.getContext("2d");
  context.clearRect(0, 0, lcd.element.width, lcd.element.height);

  deadLCDInit(lcd.pixelWidth, lcd.pixelHeight);

  startBlinkingCursor();

  window.addEventListener('resize', resizePhone, false);
  window.addEventListener('copy', copyComposer, false);
  window.addEventListener('paste', pasteComposer, false);
}

function firstBlinkCursor() {
  cursor.isBlinkedOn = !cursor.isBlinkedOn;
  cursor.blinkAction = window.setTimeout(renderingBlinkCursor, 500);
}

function renderingBlinkCursor() {
  cursor.isBlinkedOn = !cursor.isBlinkedOn;
  renderLCD();
  cursor.blinkAction = window.setTimeout(renderingBlinkCursor, 500);
}

function startBlinkingCursor() {
  // If the cursor is not currently blinking, start it blinking again.
  if (!cursor.blinkAction) {
    firstBlinkCursor();
  }
  // Stop displaying a blinking cursor after 1 minute.
  window.clearTimeout(cursor.stopBlinkAction);
  cursor.stopBlinkAction = window.setTimeout(stopBlinkingCursor, 60000);
}

function stopBlinkingCursor() {
  window.clearTimeout(cursor.blinkAction);
  cursor.blinkAction = null;

  cursor.isBlinkedOn = false;
  renderLCD();
}

var backlightTimeoutAction;
var backlit = false;
function turnOffBacklight() {
  backlit = false;

  // Display the screen shadow
  phone.screenShadowElement.style.display = "inherit";
}
function turnOnBacklight() {
  backlit = true;

  // Hide the screen shadow.
  phone.screenShadowElement.style.display = "none";

  // Turn off the backlight after 15 seconds.
  window.clearTimeout(backlightTimeoutAction);
  backlightTimeoutAction = window.setTimeout(turnOffBacklight, 15000);
}

var phoneBackgrounds = [];
phoneBackgrounds[480] = "Nokia_1100_Backlit_Background_480.png";
phoneBackgrounds[600] = "Nokia_1100_Backlit_Background_480.png";
phoneBackgrounds[720] = "Nokia_1100_Backlit_Background_480.png";
phoneBackgrounds[768] = "Nokia_1100_Backlit_Background_480.png";
phoneBackgrounds[960] = "Nokia_1100_Backlit_Background_480.png";
phoneBackgrounds[1080] = "Nokia_1100_Backlit_Background_480.png";
phoneBackgrounds[1136] = "Nokia_1100_Backlit_Background_480.png";
phoneBackgrounds[1200] = "Nokia_1100_Backlit_Background_1600.png";
phoneBackgrounds[1600] = "Nokia_1100_Backlit_Background_1600.png";
phoneBackgrounds[3857] = "Nokia_1100_Backlit_Background_3857.png";

var phoneForegrounds = [];
phoneForegrounds[480] = "Nokia_1100_Backlit_Foreground_480.png";
phoneForegrounds[600] = "Nokia_1100_Backlit_Foreground_480.png";
phoneForegrounds[720] = "Nokia_1100_Backlit_Foreground_480.png";
phoneForegrounds[768] = "Nokia_1100_Backlit_Foreground_480.png";
phoneForegrounds[960] = "Nokia_1100_Backlit_Foreground_480.png";
phoneForegrounds[1080] = "Nokia_1100_Backlit_Foreground_480.png";
phoneForegrounds[1136] = "Nokia_1100_Backlit_Foreground_480.png";
phoneForegrounds[1200] = "Nokia_1100_Backlit_Foreground_1600.png";
phoneForegrounds[1600] = "Nokia_1100_Backlit_Foreground_1600.png";
phoneForegrounds[3857] = "Nokia_1100_Backlit_Foreground_3857.png";

function loadProperImages() {
  var viewHeight = Math.min(window.innerHeight, screen.height);
  var desiredImageHeight = 0;
  for (var height in phoneBackgrounds) {
    desiredImageHeight = height;
    if (viewHeight <= height) {
      break;
    }
  }
  if (desiredImageHeight != phone.previousDesiredImageHeight) {
    phone.backgroundElement.src = phoneBackgrounds[desiredImageHeight];
    phone.screenShadowElement.src = phoneBackgrounds[desiredImageHeight];
    phone.foregroundElement.src = phoneForegrounds[desiredImageHeight];
    phone.previousDesiredImageHeight = desiredImageHeight;
  }
}


function renderLCD() {
  var ratioX = phone.width / phone.actualWidth;
  var ratioY = phone.height / phone.actualHeight;

  // Disable the drop shadow.
  context.shadowColor = "rgba(0, 0, 0, 0)";
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.clearRect(0, 0, lcd.element.width, lcd.element.height);

  // If the lcd is turned off, we are done.
  if (lcd.on !== true) {
    return;
  }

  // Display the backlight when backlit.
  if (backlit) {
    context.fillStyle = "rgba(216, 235, 49, 0.40)";
    // This doesn't bleed to the full surface of the lcd, unfortunately.
    // This can be done by making the lcd background a separate image from
    // the phone image, placing the canvas between the lcd background and
    // the phone like a sandwich. After doing this, the drawable area of the
    // canvas will be bigger than before, so we need to modify the code that
    // draws to the canvas to draw to the correct places.
    context.fillRect(0, 0, lcd.element.width, lcd.element.height);
  }

  // Display the visible area of the LCD.
  context.fillStyle = "rgba(20, 20, 20, 0.05)";
  renderBitmap(context, 0, 0, deadLCD);

  // Display a shadow when not backlit when drawing pixels.
  if (!backlit) {
    context.shadowColor = "rgba(0, 0, 0, 0.25)";
    context.shadowBlur = 6;
    context.shadowOffsetX = -6 * ratioX;
    context.shadowOffsetY = 4 * ratioY;
  }

  context.fillStyle = "rgb(0, 0, 0)";
  renderBitmap(context, 1, 0, composerNotesBitmap);
  displayNotesRemaining(context);
  displayNotes(composerSong.notes);
  displayCursor(context);
  displaySoftButton(context, "Play");
}

function displaySoftButton(context, name) {
  var width = 0;
  for (var i = 0; i < name.length; i++) {
    width += composerFont[name.charAt(i)].width;
  }
  var destX = Math.floor(lcd.pixelWidth / 2) - Math.floor(width / 2);
  var destY = lcd.pixelHeight - composer_y.height;

  displayComposerString(name, destX, destY);
}

function displayComposerString(text, destX, destY) {
  for (var i = 0; i < text.length; i++) {
    var bitmap = composerFont[text.charAt(i)];
    if (bitmap) {
      renderBitmap(context, destX, destY, bitmap);
      destX += bitmap.width;
    }
  }
}

function getComposerStringWidth(text) {
  var width = 0;
  for (var i = 0; i < text.length; i++) {
    var bitmap = composerFont[text.charAt(i)];
    if (bitmap) {
      width += bitmap.width;
    }
  }
  return width;
}

function displayNotes(notes) {
  var lines = [];
  var currentLineIndex = 0;
  lines[currentLineIndex] = {};
  lines[currentLineIndex].notes = [];

  // TODO wrap lines not just on note boundaries, but also after '#'.
  for (var i = 0; i < notes.length; i++) {
    lines[currentLineIndex].notes.push(notes[i]);
    var composer = toComposer(lines[currentLineIndex].notes).trim();
    var newWidth = getComposerStringWidth(composer);
    if (newWidth > lcd.pixelWidth) {
      lines[currentLineIndex].notes.splice(-1, 1);
      lines[currentLineIndex].endNoteIndex = i;
      currentLineIndex += 1;
      lines[currentLineIndex] = {};
      lines[currentLineIndex].notes = [];
      lines[currentLineIndex].notes.push(notes[i]);
    }
    lines[currentLineIndex].endNoteIndex = i + 1;
  }

  // Position the cursor.
  cursor.line = 0;
  while (cursor.position > lines[cursor.line].endNoteIndex) {
    cursor.line += 1;
  }

  // Figure out which lines to display.
  var startLine = cursor.line - 2;
  if (startLine < 0) {
    startLine = 0;
  }
  var endLine = startLine + 3;

  var line = lines[cursor.line];
  if (line.notes.length > 0) {
    var localX = cursor.position - (line.endNoteIndex - line.notes.length);
    var composer = toComposer(line.notes.slice(0, localX)).trim();
    cursor.destX = getComposerStringWidth(composer);
    cursor.destY = (1 + cursor.line - startLine) * (composer_y.height + 1);
  } else {
    cursor.destX = 0;
    cursor.destY = composer_y.height;
  }

  // Display the lines.
  for (var i = startLine; i < endLine; i++) {
    var line = lines[i];
    if (line) {
      var composer = toComposer(line.notes).trim();
      var destY = (i - startLine + 1) * (composer_y.height + 1);
      displayComposerString(composer, 1, destY);
    }
  }
}

function displayCursor(context) {
  if (cursor.isBlinkedOn) {
    renderBitmap(context, cursor.destX, cursor.destY, composer_Cursor);
  }
}

function moveCursorUp() {
  if (composerSong.notes.length > 0) {
    cursor.position -= 1;
    if (cursor.position < 0) {
      cursor.position = composerSong.notes.length;
    }
  }
}

function moveCursorDown() {
  if (composerSong.notes.length > 0) {
    cursor.position += 1;
    if (cursor.position > composerSong.notes.length) {
      cursor.position = 0;
    }
  }
}

function displayNotesRemaining(context) {
  var ones = notesRemaining % 10;
  var tens = Math.floor(notesRemaining / 10);

  // Note: The notesRemaining bitmap font is fixed-width.
  var notesRemainingStart = lcd.pixelWidth - notesRemaining_0.width * 2;

  // Render tens place.
  renderBitmap(context, notesRemainingStart, 0, notesRemainingFont[tens]);

  // Render ones place.
  renderBitmap(
    context,
    notesRemainingStart + notesRemaining_0.width,
    0,
    notesRemainingFont[ones]
  );
}

function renderBitmap(context, destX, destY, bitmap) {
  if (!bitmap) {
    return;
  }
  var ratioX = lcd.width / lcd.actualWidth;
  var ratioY = lcd.height / lcd.actualHeight;
  var visibleRatioX = (lcd.visibleWidth / lcd.actualWidth) * ratioX;
  var visibleRatioY = (lcd.visibleHeight / lcd.actualHeight) * ratioY;

  for (var i = 0; i < bitmap.width; i++) {
    for (var j = 0; j < bitmap.height; j++) {
      if (bitmap.bitmap[j * bitmap.width + i] == 1) {
        if (i < lcd.pixelWidth && j < lcd.pixelHeight && i >= 0 && j >= 0) {
          var x = (destX + i) * pixel.horizonalSpace +
            (destX + i) * pixel.width;
          var y = (destY + j) * pixel.verticalSpace +
            (destY + j) * pixel.height;
          var width = pixel.width;
          var height = pixel.height;
          context.fillRect(
            x * visibleRatioX + (lcd.visibleLeft - lcd.actualLeft) * ratioX,
            y * visibleRatioY + (lcd.visibleTop - lcd.actualTop) * ratioY,
            pixel.width * visibleRatioX,
            pixel.height * visibleRatioY
          );
        }
      }
    }
  }
}

function displayButtons() {
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].element.style.display = "inherit";
  }
}

function pressButton(button) {
  button.imageElement.style.opacity = 1.00;
}

function unpressButton(button) {
  button.imageElement.style.opacity = 0.01;
}

function resizePhone() {
  // XXX Uncomment me after you have the images from ben.
  //loadProperImages();

  if (autoscale) {
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
  } else {
    phone.height = phone.actualHeight;
    phone.width = phone.actualWidth;
    phone.left = window.innerWidth / 2 - phone.width / 2;
    phone.top = 0;
  }
  // Apply
  if (phone.foregroundElement) {
    resizeImage(phone.foregroundElement, phone);
  }
  if (phone.backgroundElement) {
    resizeImage(phone.backgroundElement, phone);
  }
  if (phone.screenShadowElement) {
    resizeImage(phone.screenShadowElement, phone);
  }

  for (var i = 0; i < buttons.length; i++) {
    resizePhoneElement(buttons[i], phone);
    resizeImage(buttons[i].imageElement, phone);
  }
  resizeLCD(lcd, phone);
}

function resizeImage(imageElement, phone)
{
  imageElement.width = phone.width;
  imageElement.height = phone.height;
  imageElement.style.left = phone.left + "px";
  imageElement.style.top = phone.top + "px";
}

function resizeLCD(lcd, phone)
{
  var ratioX = phone.width / phone.actualWidth;
  var ratioY = phone.height / phone.actualHeight;
  lcd.left = lcd.actualLeft * ratioX + phone.left;
  lcd.top = lcd.actualTop * ratioY + phone.top;
  lcd.width = lcd.actualWidth * ratioX;
  lcd.height = lcd.actualHeight * ratioY;

  // Apply
  lcd.element.style.left = lcd.left + "px";
  lcd.element.style.top = lcd.top + "px";
  var resized = false;
  if (lcd.width !== lcd.element.width) {
    lcd.element.width = lcd.width;
    resized = true;
  }
  if (lcd.height !== lcd.element.height) {
    lcd.element.height = lcd.height;
  }
  if (resized) {
    context.clearRect(0, 0, lcd.element.width, lcd.element.height);
  }
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

function copyComposer(event) {
  event.clipboardData.setData("text/plain", composerSong.toComposer().trim());
  event.preventDefault();
}

function pasteComposer(event) {
  var data = event.clipboardData.getData('text/plain');

  if (data) {
    loadSong(composerSong, data);
    startBlinkingCursor();
    renderLCD();
  }

  event.preventDefault();
}

function loadSong(song, notes)
{
  composerSong.stop();
  composerSong.notes = [];
  song.parse(notes);
  updateTempo();
  cursor.position = song.notes.length;
  cursor.updateFromPreviousNote();
  updateNotesRemaining();
}

function updateTempo() {
  var tempoSelect = document.getElementById('tempo');
  var currentTempo = composerSong.tempo;

  // If the current tempo in not in the list, add it and then point the
  // dropdown at it.
  if (tempos.indexOf(currentTempo) < 0) {
    tempos.push(currentTempo);
    tempos.sort(
      function(a, b) {
        return a - b;
      }
    );
  }
  tempoSelect.selectedIndex = tempos.indexOf(currentTempo);
}

function initControls() {
  var currentTempo = composerSong.tempo;
  var tempoSelect = document.getElementById('tempo');
  tempoSelect.onchange = function() {
    composerSong.tempo = tempos[tempoSelect.selectedIndex];
  };
  for (var i = 0; i < tempos.length; i++) {
    var tempoOption = document.createElement('option');
    tempoOption.value = tempos[i];
    tempoOption.text = tempos[i];
    tempoSelect.appendChild(tempoOption);
    if (tempos[i] === currentTempo) {
      tempoSelect.selectedIndex = i;
    }
  }

  var controls = document.getElementById('extra-controls');
  controls.style.display = "inherit";
}

function updateNotesRemaining() {
  notesRemaining = 50 - composerSong.notes.length;
  if (notesRemaining < 0) {
    notesRemaining = 0;
  }
}

// The following is a list of tempos that the Nokia composer can play, with one
// extra added (240) for the Nokia tune.
var tempos = [
  40,
  45,
  50,
  56,
  63,
  70,
  80,
  90,
  100,
  112,
  125,
  140,
  160,
  180,
  200,
  225,
  240,
];
