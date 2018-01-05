import Tone from 'tone'
import {normalize, magnitude, dot} from '../utils'

export default class Splash {
  constructor(index) {
    this._index = index

    this.frequency = this._getBaseFrequency(index)

    this.output = new Tone.Volume(-6.0)

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
    var softGain = new Tone.Gain(1.0).connect(this.output)

    this.softLFO = new Tone.LFO({
      frequency: 20.0,
      type: 'sawtooth',
      min: 0.8,
      max: 0.0
    }).start()
    var lfoFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 1000
    })

    this.softFilter = new Tone.Filter({
      frequency: 5000,
      type: 'highpass',
      Q: 1.0,
      gain: 0.8
    }).connect(softGain)

    this.softLFO.chain(lfoFilter, softGain.gain)

    this.softEnvelope = new Tone.Volume(-12.0).connect(this.softFilter)
  }

  _createSource() {
    const source = new Tone.Gain()
    const harmonicity = 1.5
    const modulationIndex = 5000

    var carrier = new Tone.Oscillator({
      type: 'sine',
      frequency: this.frequency
    }).start()

    var modulator = new Tone.Oscillator({
      type: 'sine',
      frequency: this.frequency * harmonicity,
      volume: -12.0
    }).start()

    var modulationNode = new Tone.Multiply(modulationIndex)

    modulator.connect(modulationNode)
    modulationNode.connect(carrier.frequency)
    carrier.connect(source)

    return source
  }

  connect(node) {
    this.output.connect(node)
  }

  updateObject(object) {
    let volume = -96.0
    let frequency = 20000
    const {position, lastDelta} = object

    const positionMagnitude = magnitude(position)
    const velocityMagnitude = magnitude(lastDelta)

    if (positionMagnitude > 0.01) {
      let limitedMagnitude = Math.min(0.6, positionMagnitude)

      // const dotProduct = dot(normalize(position), normalize(lastDelta))
      // const movingAway = (dotProduct > 0.0)

      volume += 48.0 + (2.0 * limitedMagnitude) * 48.0
      volume = Math.min(0.0, volume)

      let eased = 1.0 - Math.pow(1.0 - limitedMagnitude, 2.0)
      frequency = 10000.0 - eased * 9000.0
    }

    this.softEnvelope.volume.value = volume
    this.softFilter.frequency.value = frequency
  }

  trigger() {
    this.triggerEnvelope.triggerAttackRelease(0.05)
  }

  _getBaseFrequency(index) {
    let factor = Math.pow(1.5, index)
    factor = 1.0 + (factor % 1.0)
    return 110.0 * factor
  }
}
