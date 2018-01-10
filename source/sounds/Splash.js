import Tone from 'tone'
import {settings} from '../settings'
import {normalize, magnitude, angle, dot} from '../utils'

export default class Splash {
  constructor(index) {
    this._index = index
    this._motionModulations = []

    this.frequency = this._getBaseFrequency()

    this.mix = this._createSignalChain()
  }

  connect(node) {
    this.mix.connect(node)
  }

  modulateMotion({position, lastDelta, stable}) {
    if (!stable) {
      const motionParams = {
        position,
        distance: magnitude(position) / settings.maxDistance,
        velocity: magnitude(lastDelta),
        motionAngle: angle(lastDelta),
        movingToCenter: (dot(normalize(position), normalize(lastDelta)) < 0.0)
      }
      this._motionModulations.forEach(motionModulation => {
        motionModulation(motionParams)
      })
    }
  }

  trigger() {
    this.triggerEnvelope.triggerAttackRelease(0.3)
    this.triggerFilterEnvelope.triggerAttackRelease(0.02)
  }

  _createSignalChain() {
    this.pannedOutput = this._createPannerNode()

    const prepanOutput = new Tone.Volume(0.0).connect(this.pannedOutput)

    const triggerChainInput = this._createTriggerChain(prepanOutput)
    const softChainInput = this._createSoftChain(prepanOutput)

    const sourceNode = this._createSourceNode()
    sourceNode.fan(triggerChainInput, softChainInput)

    return this.pannedOutput
  }
  
  _createPannerNode() {
    const pannedOutput = new Tone.Panner()
    this._addMotionModulation(
      ({position}) => {
        let pan = position.x
        pan *= 2.0
        pan = Math.min(1.0, Math.max(-1.0, pan))
        pannedOutput.pan.value = pan
      }
    )
    return pannedOutput
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
    const softVolume = new Tone.Volume(0.0).connect(output)
    this._addMotionModulation(
      ({distance}) => {
        let volume = -48.0 + distance * 2.0 * 48.0
        volume = Math.min(0.0, volume)
        softVolume.volume.value = volume
      }
    )

    const softGain = new Tone.Gain(1.0).connect(softVolume)

    const softLFO = new Tone.LFO({
      frequency: 5.0,
      type: 'sine',
      min: 0.5,
      max: 0.3
    }).start()
    this._addMotionModulation(
      ({distance, movingToCenter}) => {
        let lfoFrequency = 2.5
        if (!movingToCenter) {
          lfoFrequency *= 1.0 + distance * 0.5
        }
        softLFO.frequency.value = lfoFrequency
      }
    )

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

    const noise = new Tone.Noise({
      type: 'white',
      volume: -48.0
    }).connect(softFilter).start()
    this._addMotionModulation(
      ({distance, movingToCenter}) => {
        let noiseVolume = -48.0
        if (movingToCenter) {
          noiseVolume = -36.0 - distance * 24.0
        }
        noise.volume.value = noiseVolume
      }
    )

    softLFO.chain(lfoFilter, lfoPow, softGain.gain)

    return softFilter
  }

  _createSourceNode() {
    const sourceNode = new Tone.Gain()
    const harmonicity = 3.0
    const modulationIndex = 5000

    const carrier = new Tone.Oscillator({
      type: 'sine',
      frequency: this.frequency,
      volume: -18.0
    }).start()

    const sourceModulator = new Tone.Oscillator({
      type: 'sine16',
      frequency: this.frequency * harmonicity,
      volume: -24.0
    }).start()

    const modulationScale = new Tone.AudioToGain()
    const modulationNode = new Tone.Gain(0)

    sourceModulator.chain(modulationScale, modulationNode.gain)
    modulationNode.connect(carrier.frequency)
    carrier.chain(modulationNode, sourceNode)

    return sourceNode
  }

  _getBaseFrequency() {
    let factor = Math.pow(1.5, this._index)
    factor = 1.0 + (factor % 1.0)
    return 110.0 * factor
  }

  _addMotionModulation(motionModulation) {
    this._motionModulations.push(motionModulation)
  }
}
