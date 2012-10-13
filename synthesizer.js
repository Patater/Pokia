var audioContext;
var nokiawave;
var globalGain;
var songGain;
var wavetable;
var frequencyData;

Note = function() {
  this.isSharp = false;
  this.octave = 4;
  this.note = 'c';
  this.dot = '';
  this.frequency = Song.NOTE_C4;

  this.duration = Song.QUARTER_NOTE;

  // Time until the next note can play.
  this.spacing = 0.01;

  // If this is true, then frequency will be ignored and we'll "rest" instead
  // of playing for the specified duration.
  this.pause = false;
}

Note.prototype.toggleDot = function() {
  if (this.dot === '') {
    this.dot = '.';
  } else {
    this.dot = '';
  }
}

Note.prototype.toggleSharp = function() {
  var sharpToggled = Song.sharpMap[this.frequency];
  if (sharpToggled) {
    this.frequency = sharpToggled;
    this.isSharp = !this.isSharp;

    // XXX I don't like this because we are storing composer specific stuff here
    // when the Note can be used for RTTTL, too.
    if (this.isSharp) {
      // We are now sharp, so prepend a hash.
      this.note = "#" + this.note;
    } else {
      // We are no longer sharp, so omit an assumed hash.
      this.note = this.note.charAt(1);
    }
  }
}

Note.prototype.getComposerOctave = function() {
  // Nokia Composer's octave 1 is actually octave 5.
  return this.octave - 4;
}

Note.prototype.setComposerOctave = function(octave) {
  // Nokia Composer's octave 1 is actually octave 5.
  this.octave = parseInt(octave) + 4;
}

Note.prototype.setComposerNote = function(note, octave) {
  this.note = note;
  this.isSharp = note in Song.sharpList;
  this.setComposerOctave(octave);

  if (note == "c") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_C5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_C6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_C7;
    } else {
      this.pause = true;
    }
  } else if (note == "#c") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_CS5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_CS6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_CS7;
    } else {
      this.pause = true;
    }
  } else if (note == "d") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_D5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_D6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_D7;
    } else {
      this.pause = true;
    }
  } else if (note == "#d") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_DS5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_DS6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_DS7;
    } else {
      this.pause = true;
    }
  } else if (note == "e") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_E5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_E6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_E7;
    } else {
      this.pause = true;
    }
  } else if (note == "f") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_F5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_F6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_F7;
    } else {
      this.pause = true;
    }
  } else if (note == "#f") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_FS5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_FS6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_FS7;
    } else {
      this.pause = true;
    }
  } else if (note == "g") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_G5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_G6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_G7;
    } else {
      this.pause = true;
    }
  } else if (note == "#g") {
    if (this.octave == 5) {
      this.frequency = Song.NOTE_GS5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_GS6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_GS7;
    } else {
      this.pause = true;
    }
  } else if (note == "a") {
    if (this.octave == 4) {
      this.frequency = Song.NOTE_A4;
    } else if (this.octave == 5) {
      this.frequency = Song.NOTE_A5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_A6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_A7;
    } else {
      this.pause = true;
    }
  } else if (note == "#a") {
    if (this.octave == 4) {
      this.frequency = Song.NOTE_AS4;
    } else if (this.octave == 5) {
      this.frequency = Song.NOTE_AS5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_AS6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_AS7;
    } else {
      this.pause = true;
    }
  } else if (note == "b") {
    if (this.octave == 4) {
      this.frequency = Song.NOTE_B4;
    } else if (this.octave == 5) {
      this.frequency = Song.NOTE_B5;
    } else if (this.octave == 6) {
      this.frequency = Song.NOTE_B6;
    } else if (this.octave == 7) {
      this.frequency = Song.NOTE_B7;
    } else {
      this.pause = true;
    }
  }
}

Song = function() {
  // http://merwin.bespin.org/t4a/specs/nokia_rtttl.txt
  this.defaultOctave = 6;
  this.defaultDuration = 4;
  this.defaultTempo = 63;

  this.notes = [];
}

Song.prototype.toComposer = function() {
  var composer = "";
  for (var i = 0; i < this.notes.length; i++) {
    var note = this.notes[i];
    composer += note.duration;
    if (note.pause === true) {
      composer += '-';
    } else {
      composer += note.dot;
      composer += note.note;
      composer += note.getComposerOctave();
    }
    composer += " ";
  }
  return composer;
}

Song.prototype.parseComposer = function(name, tempo, composer) {
  var spaceTokens = composer.split(" ");
  this.name = name;
  this.defaultTempo = tempo;

  for (var i = 0; i < spaceTokens.length; i++) {
    this.parseComposerNote(spaceTokens[i]);
  }
}

// 4- 4.c2 4.#c2 ("4.-" doesn't seem possible to enter)
// optional: . #
Song.prototype.parseComposerNote = function(note) {
  var noteToAdd = new Note();
  var regexNum = /\d/;
  var regexNote = /[cdefgab#]/;
  var i = 0;
  var start = 0;

  // Until we reach a non-digit
  while (regexNum.test(note.charAt(i))) {
    i++;
  }
  // i may point to the first non-digit or the beginning of the string
  var duration = note.substring(start, i);
  start = i;
  if (duration != "") {
    noteToAdd.duration = parseInt(duration, 10);
  } else {
    // Don't add an invalid note.
    return;
  }

  // Is current character a '.'?
  if (note.charAt(i) == ".") {
    noteToAdd.toggleDot();
    i++;
    start = i;
  }

  // Is current character a '-'?
  if (note.charAt(i) == "-") {
    noteToAdd.pause = true;
    this.notes.push(noteToAdd);
    return;
  }

  // Until we reach a non-note
  while (regexNote.test(note.charAt(i))) {
    i++;
  }
  // i may point to the first non-digit or the end of the string
  var whichNote = note.substring(start, i);
  start = i;

  // Until we reach a non-number
  while (regexNum.test(note.charAt(i))) {
    i++;
  }
  var octave = note.substring(start, i);
  noteToAdd.setComposerNote(whichNote, parseInt(octave, 10));

  this.notes.push(noteToAdd);
}

Song.prototype.parseRTTTL = function(rtttl) {
  var colonTokens = rtttl.split(":");
  this.name = colonTokens[0];
  this.parseDefaults(colonTokens[1]);
  this.parseSong(colonTokens[2]);
}

Song.prototype.parseDefaults = function(defaults) {
  var commaTokens = defaults.split(",");
  for (var i = 0; i < commaTokens.length; i++) {
    if (commaTokens[i][0] == "o") {
      this.defaultOctave = parseInt(commaTokens[i].substring(2), 10);
    } else if (commaTokens[i][0] == "d") {
      this.defaultDuration = parseInt(commaTokens[i].substring(2), 10);
    } else if (commaTokens[i][0] == "b") {
      this.defaultTempo = parseInt(commaTokens[i].substring(2), 10);
    }
  }
}

Song.prototype.parseSong = function(song) {
  var commaTokens = song.split(",");
  for (var i = 0; i < commaTokens.length; i++) {
    this.parseNote(commaTokens[i]);
  }
}

Song.prototype.parseNote = function(note) {
  var noteToAdd = new Note();
  var regexNum = /\d/;
  var regexNote = /[PCDEFGAB#]/;
  var regexDot = /./;
  var i = 0;
  var start = 0;
  // Until we reach a non-digit
  while (regexNum.test(note.charAt(i))) {
    i++;
  }
  // i may point to the first non-digit or the beginning of the string
  var duration = note.substring(start, i);
  start = i;
  if (duration != "") {
    noteToAdd.duration = parseInt(duration, 10);
  } else {
    noteToAdd.duration = this.defaultDuration;
  }
  //
  // Until we reach a non-note
  while (regexNote.test(note.charAt(i))) {
    i++;
  }
  // i needs to point to the end of a note
  var whichNote = note.substring(start, i);
  start = i;
  // Until we reach a non-dot
  while (regexDot.test(note.charAt(i))) {
    i++;
  }
  // i must point to the end of the note text
  var octave = note.substring(start, i);
  if (!regexNum.test(octave)) {
    octave = this.defaultOctave;
  }
  if (whichNote == "P")
  {
    noteToAdd.pause = true;
  } else if (whichNote == "C") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_C5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_C6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_C7;
    }
  } else if (whichNote == "C#") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_CS5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_CS6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_CS7;
    }
  } else if (whichNote == "D") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_D5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_D6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_D7;
    }
  } else if (whichNote == "D#") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_DS5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_DS6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_DS7;
    }
  } else if (whichNote == "E") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_E5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_E6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_E7;
    }
  } else if (whichNote == "F") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_F5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_F6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_F7;
    }
  } else if (whichNote == "F#") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_FS5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_FS6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_FS7;
    }
  } else if (whichNote == "G") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_G5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_G6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_G7;
    }
  } else if (whichNote == "G#") {
    if (octave == "4") {
      noteToAdd.pause = true; // A4 is the lowest note.
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_GS5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_GS6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_GS7;
    }
  } else if (whichNote == "A") {
    if (octave == "4") {
      noteToAdd.frequency = Song.NOTE_A4;
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_A5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_A6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_A7;
    }
  } else if (whichNote == "A#") {
    if (octave == "4") {
      noteToAdd.frequency = Song.NOTE_AS4;
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_AS5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_AS6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_AS7;
    }
  } else if (whichNote == "B") {
    if (octave == "4") {
      noteToAdd.frequency = Song.NOTE_B4;
    } else if (octave == "5") {
      noteToAdd.frequency = Song.NOTE_B5;
    } else if (octave == "6") {
      noteToAdd.frequency = Song.NOTE_B6;
    } else if (octave == "7") {
      noteToAdd.frequency = Song.NOTE_B7;
    }
  }

  if (note.charAt(i) == ".") {
    noteToAdd.toggleDot();
  }

  this.notes.push(noteToAdd);
}

Song.prototype.play = function(when) {
  var then = when;
  for (var i = 0; i < this.notes.length; i++) {
    var note = this.notes[i];
    then += this.playNote(note, then);
  }
}

Song.prototype.playNote = function(note, when) {
  var beatLength = 4.0 * 60.0 / this.defaultTempo;
  var duration = beatLength / note.duration;
  if (note.dot === '.') {
    duration /= Song.DOT;
  }
  if (!note.pause) {
    // Every tone starts after a short delay.
    songGain.gain.setValueAtTime(0, when);
    beep(when + note.spacing, note.frequency, duration);
  }
  return duration + note.spacing;
}

Song.prototype.pause = function() {
}

function initSynthesizer() {
  try {
    audioContext = new webkitAudioContext();
  } catch(e) {
    alert(
      "Web Audio API is not supported in this browser.\n\nWhy aren't you" +
      "using Google Chrome yet?"
    );
    return;
  }
  nokiawave = audioContext.createOscillator();
  //var generatedSeries = generateSquareSeries(4096);
  //var generatedSeries = generateNokiaSeries(4096);
  var generatedSeries = nokiaSampleFFT32;
  loadWaveTable(generatedSeries, nokiawave);
  globalGain = audioContext.createGainNode();
  globalGain.gain.value = 1.0;

  songGain = audioContext.createGainNode();
  songGain.gain.value = 0;

  nokiawave.connect(songGain);
  songGain.connect(globalGain);
  globalGain.connect(audioContext.destination);

  var now = audioContext.currentTime;
  nokiawave.noteOn(now);

  if (debugMode) {
    printWavetableSweep(generatedSeries, 0, 2 * Math.PI, 256);
    plotWaveform(generatedSeries);
  }
}

// Modified from
// https://chromium.googlecode.com/svn/trunk/samples/audio/oscillator.html
function loadWaveTable(wavetableArray, oscillator) {
  // Copy into more efficient Float32Arrays.
  var n = wavetableArray.real.length;
  frequencyData = {
    "real": new Float32Array(n),
    "imag": new Float32Array(n)
  };

  for (var i = 0; i < n; ++i) {
    frequencyData.real[i] = wavetableArray.real[i];
    frequencyData.imag[i] = wavetableArray.imag[i];
  }

  wavetable = audioContext.createWaveTable(frequencyData.real, frequencyData.imag);
  oscillator.setWaveTable(wavetable);
}

// Modified from http://www.javascripter.net/faq/plotafunctiongraph.htm
// TODO: Plot x from 0 to 2 * Math.PI and y from -2 to 2
function plotWaveform(wavetableArray) {
  var canvas = document.getElementById("waveform");
  var axes = {};
  var context = canvas.getContext("2d");
  //axes.x0 = 0.5 + 0.5 * canvas.width;
  axes.x0 = 0;
  axes.y0 = 0 + 0.5 * canvas.height;
  axes.scale = 40;
  axes.doNegativeX = false;

  showAxes(context, axes);
  funGraph(context, axes,
    function(x) { return wavetableAtTime(wavetableArray, x); },
    "rgb(13, 13, 13)", 2
  );
}

function funGraph (context, axes, func, color, thick) {
  var xx;
  var yy;
  var dx = 1;
  var x0 = axes.x0;
  var y0 = axes.y0;
  var scale = axes.scale;
  var iMin = 0;
  var iMax = Math.round((context.canvas.width - x0) / dx);
  context.beginPath();
  context.lineWidth = thick;
  context.strokeStyle = color;

  for (var i = iMin; i <= iMax; i++) {
    xx = dx * i;
    yy = scale * func(xx / scale);
    if (i == iMin) {
      context.moveTo(x0 + xx, y0 - yy);
    } else {
      context.lineTo(x0 + xx, y0 - yy);
    }
  }
  context.stroke();
}

function showAxes(context, axes) {
 var x0 = axes.x0;
 var w = context.canvas.width;
 var y0 = axes.y0;
 var h = context.canvas.height;
 var xmin = axes.doNegativeX ? 0 : x0;

 context.beginPath();
 context.strokeStyle = "rgb(128,128,128)";
 context.moveTo(xmin,y0);

 context.lineTo(w,y0);  // X axis
 context.moveTo(x0,0);

 context.lineTo(x0,h);  // Y axis
 context.stroke();
}


function beep(when, freq, duration)
{
  nokiawave.frequency.setValueAtTime(freq, when);

  songGain.gain.setValueAtTime(1, when);
  songGain.gain.setValueAtTime(0, when + duration);
}

function playMetronome(when, tempo, duration)
{
  // Tempo (BPM)
  // 4 beats per whole note, 60 seconds per minute
  var beatLength = 4.0 * 60.0 / tempo;
  var clickDuration = 0.005;
  var clickFrequency = 440;

  var then = when;
  while (then <= when + duration)
  {
    var noteDuration = beatLength / Song.QUARTER_NOTE;
    beep(then, clickFrequency, clickDuration);
    then += noteDuration;
  }
}

function printWavetableSweep(wavetableArray, start, end, steps) {
  var debug = document.getElementById("debug");
  for (var i = start; i < end; i += (end - start) / steps) {
    debug.textContent += wavetableAtTime(wavetableArray, i) + "\n";
  }
}

function generateSquareSeries(samples) {
  var series = {};
  series.real = [];
  series.imag = [];
  for (var n = 0; n < samples; n++) {
    if (n % 2 == 1) {
      series.imag.push(4.0 / Math.PI * (1 / n));
    } else {
      series.imag.push(0);
    }
    series.real.push(0);
  }
  return series;
}

function wavetableAtTime(wavetableArray, t) {
  var value = 0;
  var n = wavetableArray.real.length;
  for (var i = 0; i < n; ++i) {
    value += wavetableArray.real[i] * Math.cos(i * t);
    value += wavetableArray.imag[i] * Math.sin(i * t);
  }
  value += wavetableArray.real[0] / 2;

  return value;
}

// We can just use math if we come up with an equation for generating the
// Fourier series co-efficients for a damped square wave. I'm not sure if this
// response is characteristic of the Nokia sound for all frequencies the
// classic Nokia phone can generate.
var nokiaSampleFFT32 = {
  'real': [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ],
  'imag': [
    -37.94,
    -40.96,
    -40.96,
    -49.22,
    -49.22,
    -43.27,
    -38.59,
    -41.41,
    -49.88,
    -52.91,
    -47.16,
    -39.06,
    -42.05,
    -53.96,
    -60.83,
    -56.99,
    -54.95,
    -65.73,
    -70.99,
    -67.25,
    -70.98,
    -72.94,
    -71.99,
    -71.80,
    -76.07,
    -76.28,
    -79.35,
    -78.06,
    -81.61,
    0,
    0,
    0,
  ],
}


// http://www.phy.mtu.edu/~suits/notefreqs.html
Song.NOTE_A3 = 220;
Song.NOTE_AS3 = 233.08;
Song.NOTE_B3 = 246.94;
Song.NOTE_C4 = 261.63;
Song.NOTE_CS4 = 277.18;
Song.NOTE_D4 = 293.66;
Song.NOTE_DS4 = 311.13;
Song.NOTE_E4 = 329.63;
Song.NOTE_F4 = 349.23;
Song.NOTE_FS4 = 369.99;
Song.NOTE_G4 = 392.00;
Song.NOTE_GS4 = 415.30;
Song.NOTE_A4 = 440.00;
Song.NOTE_AS4 = 466.16;
Song.NOTE_B4 = 493.88;
Song.NOTE_C5 = 523.25; // This is "c1" in Nokia Composer.
Song.NOTE_CS5 = 554.37;
Song.NOTE_D5 = 587.33;
Song.NOTE_DS5 = 622.25;
Song.NOTE_E5 = 659.26;
Song.NOTE_F5 = 698.46;
Song.NOTE_FS5 = 739.99;
Song.NOTE_G5 = 783.99;
Song.NOTE_GS5 = 830.61;
Song.NOTE_A5 = 880.00;
Song.NOTE_AS5 = 932.33;
Song.NOTE_B5 = 987.77;
Song.NOTE_C6 = 1046.50;
Song.NOTE_CS6 = 1108.73;
Song.NOTE_D6 = 1174.66;
Song.NOTE_DS6 = 1244.51;
Song.NOTE_E6 = 1318.51;
Song.NOTE_F6 = 1396.91;
Song.NOTE_FS6 = 1479.98;
Song.NOTE_G6 = 1567.98;
Song.NOTE_GS6 = 1661.22;
Song.NOTE_A6 = 1760.00;
Song.NOTE_AS6 = 1864.66;
Song.NOTE_B6 = 1975.53;
Song.NOTE_C7 = 2093.00;
Song.NOTE_CS7 = 2217.46;
Song.NOTE_D7 = 2349.32;
Song.NOTE_DS7 = 2489.02;
Song.NOTE_E7 = 2637.02;
Song.NOTE_F7 = 2793.83;
Song.NOTE_FS7 = 2959.96;
Song.NOTE_G7 = 3135.96;
Song.NOTE_GS7 = 3322.44;
Song.NOTE_A7 = 3520.00;
Song.NOTE_AS7 = 3729.31;
Song.NOTE_B7 = 3951.07;

Song.WHOLE_NOTE = 1;
Song.HALF_NOTE = 2;
Song.QUARTER_NOTE = 4;
Song.EIGHTH_NOTE = 8;
Song.SIXTEENTH_NOTE = 16;
Song.THIRTY_SECOND_NOTE = 32;
Song.DOT = 1.5;

Song.sharpMap = [];
Song.sharpMap[Song.NOTE_A3] = Song.NOTE_AS3;
Song.sharpMap[Song.NOTE_C4] = Song.NOTE_CS4;
Song.sharpMap[Song.NOTE_D4] = Song.NOTE_DS4;
Song.sharpMap[Song.NOTE_F4] = Song.NOTE_FS4;
Song.sharpMap[Song.NOTE_G4] = Song.NOTE_GS4;
Song.sharpMap[Song.NOTE_A4] = Song.NOTE_AS4;
Song.sharpMap[Song.NOTE_C5] = Song.NOTE_CS5;
Song.sharpMap[Song.NOTE_D5] = Song.NOTE_DS5;
Song.sharpMap[Song.NOTE_F5] = Song.NOTE_FS5;
Song.sharpMap[Song.NOTE_G5] = Song.NOTE_GS5;
Song.sharpMap[Song.NOTE_A5] = Song.NOTE_AS5;
Song.sharpMap[Song.NOTE_C6] = Song.NOTE_CS6;
Song.sharpMap[Song.NOTE_D6] = Song.NOTE_DS6;
Song.sharpMap[Song.NOTE_F6] = Song.NOTE_FS6;
Song.sharpMap[Song.NOTE_G6] = Song.NOTE_GS6;
Song.sharpMap[Song.NOTE_A6] = Song.NOTE_AS6;
Song.sharpMap[Song.NOTE_C7] = Song.NOTE_CS7;
Song.sharpMap[Song.NOTE_D7] = Song.NOTE_DS7;
Song.sharpMap[Song.NOTE_F7] = Song.NOTE_FS7;
Song.sharpMap[Song.NOTE_G7] = Song.NOTE_GS7;
Song.sharpMap[Song.NOTE_A7] = Song.NOTE_AS7;
Song.sharpMap[Song.NOTE_AS3] = Song.NOTE_A3;
Song.sharpMap[Song.NOTE_CS4] = Song.NOTE_C4;
Song.sharpMap[Song.NOTE_DS4] = Song.NOTE_D4;
Song.sharpMap[Song.NOTE_FS4] = Song.NOTE_F4;
Song.sharpMap[Song.NOTE_GS4] = Song.NOTE_G4;
Song.sharpMap[Song.NOTE_AS4] = Song.NOTE_A4;
Song.sharpMap[Song.NOTE_CS5] = Song.NOTE_C5;
Song.sharpMap[Song.NOTE_DS5] = Song.NOTE_D5;
Song.sharpMap[Song.NOTE_FS5] = Song.NOTE_F5;
Song.sharpMap[Song.NOTE_GS5] = Song.NOTE_G5;
Song.sharpMap[Song.NOTE_AS5] = Song.NOTE_A5;
Song.sharpMap[Song.NOTE_CS6] = Song.NOTE_C6;
Song.sharpMap[Song.NOTE_DS6] = Song.NOTE_D6;
Song.sharpMap[Song.NOTE_FS6] = Song.NOTE_F6;
Song.sharpMap[Song.NOTE_GS6] = Song.NOTE_G6;
Song.sharpMap[Song.NOTE_AS6] = Song.NOTE_A6;
Song.sharpMap[Song.NOTE_CS7] = Song.NOTE_C7;
Song.sharpMap[Song.NOTE_DS7] = Song.NOTE_D7;
Song.sharpMap[Song.NOTE_FS7] = Song.NOTE_F7;
Song.sharpMap[Song.NOTE_GS7] = Song.NOTE_G7;
Song.sharpMap[Song.NOTE_AS7] = Song.NOTE_A7;

Song.sharpList = [];
Song.sharpList.push(Song.NOTE_AS3);
Song.sharpList.push(Song.NOTE_AS3);
Song.sharpList.push(Song.NOTE_CS4);
Song.sharpList.push(Song.NOTE_DS4);
Song.sharpList.push(Song.NOTE_FS4);
Song.sharpList.push(Song.NOTE_GS4);
Song.sharpList.push(Song.NOTE_AS4);
Song.sharpList.push(Song.NOTE_CS5);
Song.sharpList.push(Song.NOTE_DS5);
Song.sharpList.push(Song.NOTE_FS5);
Song.sharpList.push(Song.NOTE_GS5);
Song.sharpList.push(Song.NOTE_AS5);
Song.sharpList.push(Song.NOTE_CS6);
Song.sharpList.push(Song.NOTE_DS6);
Song.sharpList.push(Song.NOTE_FS6);
Song.sharpList.push(Song.NOTE_GS6);
Song.sharpList.push(Song.NOTE_AS6);
Song.sharpList.push(Song.NOTE_CS7);
Song.sharpList.push(Song.NOTE_DS7);
Song.sharpList.push(Song.NOTE_FS7);
Song.sharpList.push(Song.NOTE_GS7);
Song.sharpList.push(Song.NOTE_AS7);
