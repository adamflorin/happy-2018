import Tone from 'tone'

export default class Flutter {
  constructor(index) {
    this._oscillator = new Tone.Oscillator({
    	type: 'sawtooth',
    	frequency: 220 * Math.pow(1.5, index),
    	volume: -24.0,
    })

    this._filter = new Tone.Filter({
      frequency: 5000.0,
      type: 'lowpass',
      rolloff: -48.0
    })

    this._oscillator.connect(this._filter)

    this._oscillator.start()
  }

  updateDistance(distance) {
    distance = Math.pow(distance, 1.5)
    let value = 50.0 + distance * 8000.0
    this._filter.frequency.value = value
  }

  connect(node) {
    this._filter.connect(node)
  }
}
