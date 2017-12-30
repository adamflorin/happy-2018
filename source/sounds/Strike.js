import Tone from 'tone'

class Strike {
  constructor() {
    this._numPartials = 15

    this._envelope = this._initEnvelope()

    this._oscillator =
      this._initOscillator()
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

  _initOscillator() {
    return new Tone.Oscillator({
    	partials: this._generatePartials(),
    	type: "custom",
    	frequency: "C#2",
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

export default new Strike()
