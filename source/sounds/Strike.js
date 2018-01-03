import Tone from 'tone'

var strikeSynth = new Tone.PolySynth(7, Tone.Synth).toMaster();

class Strike {
  constructor(index) {
    this._index = index
  }

  trigger() {
    let frequency = 110.0 * Math.pow(1.5, this._index)
    strikeSynth.triggerAttackRelease(frequency, 0.2)
  }
}

module.exports = {
  strikeSynth,
  Strike
}
