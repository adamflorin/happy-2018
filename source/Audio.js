import Tone from 'tone'

const synth = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 2,
  envelope: {
    attack: 0.001,
    decay: 0.9,
    sustain: 0.2,
    release: 1.5,
    // attackCurve: exponential
  }
}).toMaster()

function playSound() {
  synth.triggerAttackRelease("C2", "8n")
}

module.exports = {
  playSound
}
