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

function frequency(pitch) {
gainNode.gain.setValueAtTime(100, audioCTX.currentTime);
oscillator.frequency.setValueAtTime(pitch, audioCTX.currentTime);
gainNode.gain.setValueAtTime(0, audioCTX.currentTime + 1);
}


function handle() {
    audioCTX.resume();
    gainNode.gain.value = 0;
   var usersnotes = String(input.value)
   frequency(notes.get(usersnotes));
}