import Tone from 'tone'

export default class Strike {
  constructor(index) {
    this._index = index
    this._synth = new Tone.DuoSynth({
      volume: -6.0
    })
  }

  trigger() {
    let frequency = 110.0 * Math.pow(1.5, this._index)
    this._synth.triggerAttackRelease(frequency, 0.2)
  }

  connect(node) {
    this._synth.connect(node)
  }
}
