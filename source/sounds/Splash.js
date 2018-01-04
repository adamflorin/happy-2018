import Tone from 'tone'
import {normalize, magnitude, dot} from '../utils'

const defaultVolume = -12.0

export default class Splash {
  constructor(index) {
    this.frequency = this._getBaseFrequency(index)

    this.output = new Tone.Volume(0.0)

    this._createSoftChain()
    this._createTriggerChain()

    this.source = this._createSource()
    this.source.fan(this.triggerGain, this.softEnvelope)
  }

  _createTriggerChain() {
    this.triggerFilter = new Tone.Filter({
      frequency: 500,
      type: 'lowpass',
      Q: 5.0,
      gain: 2.0
    }).connect(this.output)

    this.triggerGain = new Tone.Gain(0.2).connect(this.triggerFilter)

    this.triggerEnvelope = new Tone.Envelope().connect(this.triggerGain.gain)
  }

  _createSoftChain() {
    this.softFilter = new Tone.Filter({
      frequency: 5000,
      type: 'bandpass',
      Q: 1.0,
      gain: 0.8
    }).connect(this.output)

    this.softEnvelope = new Tone.Volume(defaultVolume).connect(this.softFilter)
  }

  _createSource() {
    const source = new Tone.Gain()

    new Tone.Oscillator({
      type: 'sawtooth',
      frequency: this.frequency * 0.99
    }).connect(source).start()

    return source
  }

  connect(node) {
    this.output.connect(node)
  }

  updateObject(object) {
    let volume = -96.0
    const {position, lastDelta} = object

    const positionMagnitude = magnitude(position)
    const velocityMagnitude = magnitude(lastDelta)

    if (velocityMagnitude > 0.01) {
      const dotProduct = dot(normalize(position), normalize(lastDelta))
      const movingAway = (dotProduct > 0.0)
      if (movingAway) {
        volume += 48.0 + (2.0 * positionMagnitude) * 48.0
        volume = Math.min(0.0, volume)
      }
    }

    this.softEnvelope.volume.value = volume
  }

  trigger() {
    this.triggerEnvelope.triggerAttackRelease(0.05)
  }

  _getBaseFrequency(index) {
    return 110.0 * Math.pow(1.5, index)
  }
}
