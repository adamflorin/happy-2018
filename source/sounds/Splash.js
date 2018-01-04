import Tone from 'tone'

const defaultVolume = -12.0

export default class Splash {
  constructor(index) {
    this.frequency = this._getBaseFrequency(index)

    this.output = new Tone.Volume(0.0)

    this.softEnvelope = new Tone.Volume(defaultVolume).connect(this.output)

    this.triggerGain = new Tone.Gain(0.2).connect(this.output)
    this.triggerEnvelope = new Tone.Envelope().connect(this.triggerGain.gain)

    new Tone.Oscillator({
      type: 'sawtooth4',
      frequency: this.frequency
    }).fan(this.triggerGain, this.softEnvelope).start()
  }

  connect(node) {
    this.output.connect(node)
  }

  updateObject(object) {
    let {position, lastDelta} = object
    const distance = Math.sqrt(position.x * position.x + position.y * position.y)
    const volume = -12.0 - 96.0 * distance
    this.softEnvelope.volume.value = volume
  }

  trigger() {
    this.triggerEnvelope.triggerAttackRelease(0.05)
  }

  _getBaseFrequency(index) {
    return 110.0 * Math.pow(1.5, index)
  }
}
