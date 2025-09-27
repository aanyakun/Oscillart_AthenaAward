//defining some main variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;
var interval = null;
var reset = false;
var timepernote = 0;
var length = 0;

var blob, recorder = null;
var chunks = [];
var is_recording = false;


const input = document.getElementById('input');
const color_picker = document.getElementById('color');
const wavetype_Select = document.getElementById('wavetype');
const thickness_Slider = document.getElementById('thickness-slider');
const audioCTX = new AudioContext();
const gainNode = audioCTX.createGain();
const volume_Slider = document.getElementById('volume-slider');
const oscillator = audioCTX.createOscillator();
const recording_toggle = document.getElementById('record');
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
    oscillator.type = wavetype_Select.value;
gainNode.gain.setValueAtTime(volume_Slider.value, audioCTX.currentTime);
setting = setInterval(() => {gainNode.gain.value = volume_Slider.value}, 1);
oscillator.frequency.setValueAtTime(pitch, audioCTX.currentTime);
setTimeout(() => {clearInterval(setting);
gainNode.gain.value = 0; }, ((timepernote) - 10));
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
            frequency(noteslist[j]);
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
    y= height/2 + (volume_Slider.value/100) * 40 * Math.sin(x* ((2*Math.PI*freq * (0.5 *length))));
    ctx.lineTo(x,y);
    ctx.strokeStyle = color_picker.value;
    ctx.lineWidth = thickness_Slider.value;
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
function startRecording() {
const canvasStream = canvas.captureStream(20);
const audioDestination = audioCtx.createMediaStreamDestination();
gainNode.connect(audioDestination);
const combinedStream = new MediaStream();
canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));
recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm'});
recorder.ondataavailable = e => {
 if (e.data.size > 0) {
   chunks.push(e.data);
 }
};


recorder.onstop = () => {
   const blob = new Blob(chunks, { type: 'video/webm' });
   const url = URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = 'recording.webm';
   a.click();
   URL.revokeObjectURL(url);
};
 recorder.start();
}
var is_recording = false;
function toggle() {
is_recording = !is_recording;
if (is_recording) {
    recording_toggle.innerHTML = "Stop Recording!";
    startRecording();
} else {
    recording_toggle.innerHTML = "Start Recording!";
    recorder.stop();
    }
}

