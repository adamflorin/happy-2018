import Tone from 'tone'

export default class Flutter {
  constructor(index) {
    this._oscillator = new Tone.Oscillator({
    	type: "sine",
    	frequency: 220 * Math.pow(2.0, Math.random() * 2.0),
    	volume: -12.0,
    })
    this._oscillator.start()
  }

  updateDistance(distance) {
    if (this._oscillator === undefined) {
      return
    }
    let value = -48.0 + 24.0 * distance
    this._oscillator.volume.value = value
  }

  connect(node) {
    if (this._oscillator === undefined) {
      return
    }
    this._oscillator.connect(node)
  }
}
