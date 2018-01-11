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
    const motionParams = {
      position,
      stable,
      distance: magnitude(position) / settings.maxDistance,
      velocity: magnitude(lastDelta) * 30.0, // ~ 0 - 1.0 range (max ~ 1.5)
      motionAngle: angle(lastDelta),
      movingToCenter: (dot(normalize(position), normalize(lastDelta)) < 0.0)
    }
    this._motionModulations.forEach(motionModulation => {
      motionModulation(motionParams)
    })
  }

  trigger() {
    this.triggerEnvelope.triggerAttackRelease(0.3)
    this.triggerFilterEnvelope.triggerAttackRelease(0.02)
  }

  _createSignalChain() {
    this.pannedOutput = this._createPannerNode()

    const prepanOutput = new Tone.Volume(0.0).connect(this.pannedOutput)

    const triggerChain = this._createTriggerChain(prepanOutput)
    const flutterChain = this._createFlutterChain(prepanOutput)
    const droneChain = this._createDroneChain(prepanOutput)

    const sourceNode = this._createSourceNode()
    sourceNode.fan(triggerChain, droneChain, flutterChain)

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
    const gain = new Tone.Volume(0.0).connect(output)

    const triggerCompressor = new Tone.Compressor({
      ratio: 4.0,
      threshold: -24.0,
      attack: 0.003,
      release: 0.25,
      knee: 20.0
    }).connect(gain)

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

  _createFlutterChain(output) {
    const flutterVolume = new Tone.Volume(-18.0).connect(output)
    this._addMotionModulation(
      ({distance}) => {
        let volume = -24.0 + distance * 9.0
        volume = Math.min(-6.0, volume)
        flutterVolume.volume.value = volume
      }
    )

    const lfoGain = new Tone.Gain(1.0).connect(flutterVolume)

    const flutterLFO = new Tone.LFO({
      frequency: 5.0,
      type: 'sawtooth',
      min: 0.9,
      max: 0.3
    }).start()
    this._addMotionModulation(
      ({velocity}) => {
        let lfoFrequency = 2.5 + (velocity * 15.0)
        flutterLFO.frequency.value = lfoFrequency
      }
    )
    const lfoFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 1000,
      Q: 1.0
    })
    const lfoPow = new Tone.Pow(1.0)

    const flutterFilter = new Tone.Filter({
      frequency: this.frequency * 4.0,
      type: 'highpass',
      Q: 50.0
    }).connect(lfoGain)

    this._addMotionModulation(
      ({distance}) => {
        let Q = distance * 150.0
        Q = Math.min(40.0, Q)
        flutterFilter.Q.value = Q
      }
    )

    const noise = new Tone.Noise({
      type: 'white',
      volume: -48.0
    }).fan(flutterFilter).start()
    this._addMotionModulation(
      ({distance, movingToCenter}) => {
        let noiseVolume = -48.0 + distance * 24.0
        noise.volume.value = noiseVolume
      }
    )

    flutterLFO.chain(lfoFilter, lfoPow, lfoGain.gain)

    return flutterFilter
  }

  _createDroneChain(output) {
    const volume = new Tone.Volume(0.0).connect(output)

    const bandpass = new Tone.Filter({
      type: 'bandpass',
      frequency: 3000,
      Q: 0.5
    }).connect(volume)

    this._addMotionModulation(
      ({position, distance, movingToCenter}) => {
        let volumeValue = -24.0 + 96.0 * distance
        if (position.y > 0.0) {
          volumeValue *= 0.5
        }
        volumeValue = Math.min(6.0, volumeValue)
        volume.volume.value = volumeValue

        bandpass.frequency.value = 400.0 + 1200.0 * distance

        let Q = 0.5 + 5.0 * Math.pow(1.0 - distance, 16.0)
        if (movingToCenter) {
          Q *= 4.0
        }
        bandpass.Q.value = Q
      }
    )

    return bandpass
  }

  _createSourceNode() {
    const harmonicity = 3.01
    const modulationIndex = 5000

    const sourceNode = new Tone.Gain()

    const saw = new Tone.Oscillator({
      type: 'sawtooth32',
      frequency: this.frequency * 2.0,
      detune: -0.003 * 1200.0,
      volume: -36.0
    }).start()

    const carrier = new Tone.Oscillator({
      type: 'sine',
      frequency: this.frequency,
      volume: -18.0
    }).start()

    const sourceModulator = new Tone.Oscillator({
      type: 'sine16',
      frequency: this.frequency * harmonicity,
      detune: 0.008 * 1200.0,
      volume: -24.0
    }).start()
    this._addMotionModulation(
      ({velocity, position}) => {
        let expVelocity = Math.pow(velocity, 3.0)
        expVelocity = Math.min(expVelocity, 1.0)
        sourceModulator.detune.value = position.y * 0.04 * 1200.0
        saw.volume.value = -36.0 + 12.0 * expVelocity
      }
    )

    const modulationScale = new Tone.AudioToGain()
    const modulationNode = new Tone.Gain(0)

    sourceModulator.chain(modulationScale, modulationNode.gain)
    modulationNode.connect(carrier.frequency)
    carrier.chain(modulationNode, sourceNode)
    saw.connect(sourceNode)

    return sourceNode
  }

  _getBaseFrequency() {
    return 110.0 * (1.0 + this._index / 4.0)
  }

  _addMotionModulation(motionModulation) {
    this._motionModulations.push(motionModulation)
  }
}
