//defining some main variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 500;
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var amplitude = 54;
var interval = null;
var reset = false;
var timepernote = 0;
var length = 0;


const input = document.getElementById('input');

const audioCTX = new AudioContext();
const gainNode = audioCTX.createGain();

const oscillator = audioCTX.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCTX.destination);
oscillator.type = "sine";
oscillator.start();
gainNode.gain.value = 0;


notes = new Map();
notes.set("C", 261.6);
notes.set("D", 293.7);
notes.set("E", 329.6);
notes.set("F", 349.2);
notes.set("G", 392.0);
notes.set("A", 440);
notes.set("B", 493.9);

let currentPitch = 0;
function frequency(pitch) {
    currentPitch = pitch;
gainNode.gain.setValueAtTime(100, audioCTX.currentTime);
oscillator.frequency.setValueAtTime(pitch, audioCTX.currentTime);
gainNode.gain.setValueAtTime(0, audioCTX.currentTime + timepernote/1000 - 0.1);
}


function handle() {
    reset = true;
    var usersnotes = String(input.value);
    length = usersnotes.length;
    timepernote = 6000/ length;
    var noteslist = [];
    for (i=0; i < length; i++) {
    noteslist.push(notes.get(usersnotes.charAt(i)));
    }
    let j = 0;
    repeat = setInterval(() => {
        if (j < noteslist.length) {
            frequency(parseInt(noteslist[j]));
            drawWave();
            j++;
        } else {
            clearInterval(repeat);
        }

        }, timepernote);
    
    audioCTX.resume();
    gainNode.gain.value = 0;
    playNotes(noteslist);
   drawWave();
}

var counter = 0;
let x = 0;
let y = 0;

function line() {
    let freq = currentPitch / 10000;
    y= height/2 + amplitude * Math.sin(x*2*Math.PI*freq * (0.5 *length));
    ctx.lineTo(x,y);
    ctx.stroke();
    x = x + 1;
    counter++;
    if (counter > (timepernote/20)) {
        clearInterval(interval);
    }
}

function drawWave() {
    clearInterval(interval);
    if (reset) {
    ctx.clearRect(0,0,width, height);
    x = 0;
    y = height/2;
    ctx.beginPath();
    }
    reset = false;
    ctx.moveTo(x,y);
    counter = 0;
    interval = setInterval(line, 20);
}
