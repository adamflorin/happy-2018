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
    let frequency
    switch (index) {
      case 0:  frequency = "C#3"; break;
      case 1:  frequency = "D#3"; break;
      case 2:  frequency = "F3"; break;
      case 3:  frequency = "G3"; break;
      case 4:  frequency = "A3"; break;
      default: frequency = "B3"; break;
    }
    return new Tone.Oscillator({
    	partials: this._generatePartials(),
    	type: "custom",
    	frequency,
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
