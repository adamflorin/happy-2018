import Tone from 'tone'

export default class Flutter {
  constructor(index) {
    let volume = -24.0

    this._oscillator1 = new Tone.Oscillator({
    	type: 'square',
    	frequency: 220.0 * Math.pow(1.5, index),
    	volume,
    })
    this._oscillator2 = new Tone.Oscillator({
    	type: 'sawtooth',
    	frequency: 218.0 * 1.5* Math.pow(1.5, index),
    	volume,
    })

    this._filter = new Tone.Filter({
      frequency: 10000.0,
      type: 'lowpass',
      rolloff: -48.0
    })

    this._oscillator1.connect(this._filter)
    this._oscillator2.connect(this._filter)
    this._oscillator1.start()
    this._oscillator2.start()
  }

  updateDistance(distance) {
    distance = Math.pow((distance * 1.5), 4.0)
    let value = 100.0 + distance * 4000.0
    this._filter.frequency.value = value
  }

  connect(node) {
    this._filter.connect(node)
  }
}
