import Tone from 'tone'
import {normalize, magnitude, dot} from '../utils'

export default class Splash {
  constructor(index) {
    this._index = index

    this.frequency = this._getBaseFrequency(index)

    this.pannedOutput = new Tone.Panner()

    const prepanOutput = new Tone.Volume(0.0).connect(this.pannedOutput)
    const softChainInput = this._createSoftChain(prepanOutput)
    const triggerChainInput = this._createTriggerChain(prepanOutput)

    this._source = this._createSource()
    this._source.fan(triggerChainInput, softChainInput)
  }

  connect(node) {
    this.pannedOutput.connect(node)
  }

  updateObject(object) {
    let volume = -96.0
    let frequency = 20000
    let sourceModulatorVolume = -24.0
    let lfoFrequency = 10.0
    let noiseVolume = -48.0

    const {position, lastDelta} = object

    const positionMagnitude = magnitude(position)
    const velocityMagnitude = magnitude(lastDelta)

    if (!object.stable) {
      const movingToCenter = (dot(normalize(position), normalize(lastDelta)) < 0.0)
      const distance = positionMagnitude

      if (!movingToCenter) {
        sourceModulatorVolume = -24.0
        lfoFrequency *= 1.0 + distance * 0.5
      } else {
        lfoFrequency = 5.0
        noiseVolume = -36.0 - distance * 24.0
      }

      volume = -48.0 + positionMagnitude * 2.0 * 48.0
      volume = Math.min(0.0, volume)
    }

    // apply values
    this.softVolume.volume.value = volume
    this.sourceModulator.volume.value = sourceModulatorVolume
    this.softLFO.frequency.value = lfoFrequency
    this._noise.volume.value = noiseVolume

    let pan = position.x
    pan *= 2.0
    pan = Math.min(1.0, Math.max(-1.0, pan))
    this.pannedOutput.pan.value = pan
  }

  trigger() {
    this.triggerEnvelope.triggerAttackRelease(0.3)
    this.triggerFilterEnvelope.triggerAttackRelease(0.02)
  }

  _createTriggerChain(output) {
    const finalTriggerVolume = new Tone.Volume(-0.3).connect(output)

    const triggerCompressor = new Tone.Compressor({
      ratio: 4.0,
      threshold: -24.0,
      release: 0.25,
      attack: 0.003,
      knee: 1.0
    }).connect(finalTriggerVolume)

    const triggerFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 2000,
      Q: 5.0
    }).connect(triggerCompressor)

    this.triggerFilterEnvelope = new Tone.FrequencyEnvelope({
      attack: 0.06,
      decay: 0.2,
      sustain: 0.0,
      release: 2,
      baseFrequency: this.frequency,
      octaves: 8,
      exponent: 2
    })
    this.triggerFilterEnvelope.connect(triggerFilter.frequency)

    const triggerVolume = new Tone.Volume(0.0).connect(triggerFilter)

    const triggerGain = new Tone.Gain(0.0).connect(triggerVolume)

    this.triggerEnvelope = new Tone.Envelope({
      attack: 0.1,
      decay: 0.1,
      sustain: 0.9,
      release: 0.9
    }).connect(triggerGain.gain)

    return triggerGain
  }

  _createSoftChain(output) {
    this.softVolume = new Tone.Volume(0.0).connect(output)

    const softGain = new Tone.Gain(1.0).connect(this.softVolume)

    this.softLFO = new Tone.LFO({
      frequency: 10.0,
      type: 'sawtooth',
      min: 0.5,
      max: 0.0
    }).start()

    const lfoFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 1000,
      Q: 1.0
    })

    const lfoPow = new Tone.Pow(1.0)

    const softFilter = new Tone.Filter({
      frequency: this.frequency * 4.0,
      type: 'highpass',
      Q: 50.0
    }).connect(softGain)

    this._noise = new Tone.Noise({
      type: 'white',
      volume: -48.0
    }).connect(softFilter).start()

    this.softLFO.chain(lfoFilter, lfoPow, softGain.gain)

    return softFilter
  }

  _createSource() {
    const source = new Tone.Gain()
    const harmonicity = 3.0
    const modulationIndex = 5000

    const carrier = new Tone.Oscillator({
      type: 'sine',
      frequency: this.frequency,
      volume: -18.0
    }).start()

    this.sourceModulator = new Tone.Oscillator({
      type: 'sine16',
      frequency: this.frequency * harmonicity,
      volume: -24.0
    }).start()

    const modulationScale = new Tone.AudioToGain()
    const modulationNode = new Tone.Gain(0)

    this.sourceModulator.chain(modulationScale, modulationNode.gain)
    modulationNode.connect(carrier.frequency)
    carrier.chain(modulationNode, source)

    return source
  }

  _getBaseFrequency(index) {
    let factor = Math.pow(1.5, index)
    factor = 1.0 + (factor % 1.0)
    return 110.0 * factor
  }
}
