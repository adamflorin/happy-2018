import Tone from 'tone'

export default class Strike {
  constructor(index) {
    this._index = index
    this._synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 2,
      oscillator: {
        type: 'sine'
      },
      volume: -6.0,
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.0,
        // release: 0.05, // dontcare
        attackCurve: 'exponential'
      }
    })
  }

  trigger() {
    let frequency = 110.0 * Math.pow(1.5, this._index)
    this._synth.triggerAttackRelease(frequency)
  }

  connect(node) {
    this._synth.connect(node)
  }
}
