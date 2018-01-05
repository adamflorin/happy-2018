import Tone from 'tone'
import {normalize, magnitude, dot} from '../utils'

export default class Splash {
  constructor(index) {
    this._index = index

    this.frequency = this._getBaseFrequency(index)

    this.pannedOutput = new Tone.Panner()

    this.output = new Tone.Volume(-6.0).connect(this.pannedOutput)

    this._createSoftChain()
    this._createTriggerChain()

    this.source = this._createSource()
    this.source.fan(this.triggerGain, this.softFilter)
  }

  _createTriggerChain() {
    this.triggerFilter = new Tone.Filter({
      frequency: 500,
      type: 'lowpass',
      Q: 5.0,
      gain: 2.0
    }).connect(this.output)

    this.triggerGain = new Tone.Gain(0.2).connect(this.triggerFilter)

    this.triggerEnvelope = new Tone.Envelope({
      attack: 0.1
    }).connect(this.triggerGain.gain)
  }

  _createSoftChain() {
    this.softVolume = new Tone.Volume(0.0).connect(this.output)

    var softGain = new Tone.Gain(1.0).connect(this.softVolume)

    this.softLFO = new Tone.LFO({
      frequency: 10.0,
      type: 'sawtooth',
      min: 0.5,
      max: 0.0
    }).start()
    var lfoFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 1000
    })
    var lfoPow = new Tone.Pow(1.0)

    this.softFilter = new Tone.Filter({
      frequency: this.frequency * 4.0,
      type: 'highpass',
      Q: 80.0
    }).connect(softGain)

    new Tone.Noise({
      type: 'white',
      volume: -48.0
    }).connect(this.softFilter).start()

    this.softLFO.chain(lfoFilter, lfoPow, softGain.gain)
  }

  _createSource() {
    const source = new Tone.Gain()
    const harmonicity = 1.5
    const modulationIndex = 5000

    var carrier = new Tone.Oscillator({
      type: 'sine',
      frequency: this.frequency,
      volume: 6.0
    }).start()

    var modulator = new Tone.Oscillator({
      type: 'sine',
      frequency: this.frequency * harmonicity,
      volume: -12.0
    }).start()

    let modulationScale = new Tone.AudioToGain()
    let modulationNode = new Tone.Gain(0)

    modulator.chain(modulationScale, modulationNode.gain)
    modulationNode.connect(carrier.frequency)
    carrier.chain(modulationNode, source)

    return source
  }

  connect(node) {
    this.pannedOutput.connect(node)
  }

  updateObject(object) {
    let volume = -96.0
    let frequency = 20000
    const {position, lastDelta} = object

    const positionMagnitude = magnitude(position)
    const velocityMagnitude = magnitude(lastDelta)

    if (positionMagnitude > 0.01) {
      let limitedMagnitude = Math.min(0.6, positionMagnitude)
      limitedMagnitude = Math.pow(limitedMagnitude, 2.0)

      volume = -48.0 + limitedMagnitude * 120.0
      volume = Math.min(0.0, volume)
    }

    this.softVolume.volume.value = volume

    let pan = position.x
    pan *= 2.0
    pan = Math.min(1.0, Math.max(-1.0, pan))
    this.pannedOutput.pan.value = pan
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
