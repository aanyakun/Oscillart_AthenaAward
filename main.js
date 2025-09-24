const input = document.getElementById('input');

const audioCTX = new AudioContext();
const gainNode = audioCTX.createGain();

const oscillator = audioCTX.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCTX.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;


function frequency(pitch) {
gainNode.gain.setValueAtTime(100, audioCTX.currentTime);
oscillator.frequency.setValueAtTime(pitch, audioCTX.currentTime);
gainNode.gain.setValueAtTime(0, audioCTX.currentTime + 1);
}


function handle() {
    audioCTX.resume();
    gainNode.gain.value = 0;
    frequency(input.value);
}