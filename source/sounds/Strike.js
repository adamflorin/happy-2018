import Tone from 'tone'

export default class Strike {
  constructor(index) {
    this._numPartials = 15

    this._envelope = this._initEnvelope()

    this._oscillator =
      this._initOscillator(index)
      .connect(this._envelope)
      .start()
  }

  trigger() {
    this._envelope.triggerAttack()
  }

  connect(node) {
    this._envelope.connect(node)
  }

  _initEnvelope() {
    return new Tone.AmplitudeEnvelope({
    	attack: 0.05,
    	decay: 0.9,
    	sustain: 0.0,
    	release: 0.0
    })
  }

  _initOscillator(index) {
    return new Tone.Oscillator({
    	partials: this._generatePartials(),
    	type: "custom",
    	frequency: (index == 0 ? "C#2" : (index === 1 ? "G#2" : "B2")),
    	volume: -12,
    })
  }

  _generatePartials() {
    const partials = []
    for (let index = 0; index < this._numPartials; index++) {
      partials.push(Math.random())
    }
    return partials
  }
}
