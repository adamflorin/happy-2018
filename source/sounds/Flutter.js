import Tone from 'tone'

export default class Flutter {
  constructor(index) {
    let volume = -24.0

    this._oscillator1 = new Tone.Oscillator({
    	type: 'sine',
    	frequency: 220.0 * Math.pow(1.5, index),
    	volume,
    })
    this._oscillator2 = new Tone.Oscillator({
    	type: 'sine',
    	frequency: 218.0 * Math.pow(1.5, index),
    	volume,
    })

    this._filter = new Tone.Filter({
      frequency: 5000.0,
      type: 'lowpass',
      rolloff: -48.0
    })

    this._oscillator1.connect(this._filter)
    this._oscillator2.connect(this._filter)
    this._oscillator1.start()
    this._oscillator2.start()
  }

  updateDistance(distance) {
    distance = Math.pow(distance, 4.0)
    let value = 0.0 + distance * 8000.0
    this._filter.frequency.value = value
  }

  connect(node) {
    this._filter.connect(node)
  }
}
