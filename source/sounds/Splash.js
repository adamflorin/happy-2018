import Tone from 'tone'
import {settings} from '../settings'
import {normalize, magnitude, angle, dot} from '../utils'

export default class Splash {
  constructor(index) {
    this._index = index
    this._motionModulations = []

    this.frequency = this._getBaseFrequency()

    this.pannedOutput = new Tone.Panner()
    this.createMotionModulation(
      ({position}) => {
        let pan = position.x
        pan *= 2.0
        pan = Math.min(1.0, Math.max(-1.0, pan))
        this.pannedOutput.pan.value = pan
      }
    )

    // filters
    this.lowpassFilter = new Tone.Filter({
      type: 'lowpass',
      frequency: 2000,
      Q: 1.0,
      rolloff: -24
    })
    this.highpassFilter = new Tone.Filter({
      type: 'highpass',
      frequency: 2000,
      Q: 1.0,
      rolloff: -24
    })

    const sourceSum = new Tone.Volume(-12.0)
    const source1 = this._createSource()
    const source2 = this._createSource()
    const source3 = this._createSource()
    const source4 = this._createSource()
    source1.connect(sourceSum)
    source2.connect(sourceSum)
    source3.connect(sourceSum)
    source4.connect(sourceSum)

    sourceSum.connect(this.lowpassFilter)

    this.lowpassFilter.connect(this.highpassFilter)
    this.highpassFilter.connect(this.pannedOutput)

    this.createMotionModulation(
      ({distance}) => {
        const frequency = 150 + distance * 8000
        const widthHz = 10.0
        this.lowpassFilter.frequency.value = frequency + widthHz
        this.highpassFilter.frequency.value = frequency - widthHz

        const q = Math.pow(distance, 2.0) * 5.0
        this.highpassFilter.Q.value = q
        this.lowpassFilter.Q.value = q
      }
    )
  }

  connect(node) {
    this.pannedOutput.connect(node)
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
    //
  }

  _createSource() {
    const sum = new Tone.Volume(-6.0)

    let spread = 1.0

    const oscillator1 = new Tone.Oscillator({
      type: 'sawtooth',
      frequency: this.frequency,
      detune: 0.0 * 1200.0 * spread,
      volume: -24.0
    }).start()

    const oscillator2 = new Tone.Oscillator({
      type: 'sawtooth',
      frequency: this.frequency * 2.0,
      detune: -0.004 * 1200.0 * spread,
      volume: -24.0
    }).start()

    const oscillator3 = new Tone.Oscillator({
      type: 'sawtooth',
      frequency: this.frequency * 4.0,
      detune: 0.003 * 1200.0 * spread,
      volume: -24.0
    }).start()

    oscillator1.connect(sum)
    oscillator2.connect(sum)
    oscillator3.connect(sum)

    this.createMotionModulation(
      ({distance}) => {
        spread = 1.0 + distance * 1.0
        oscillator1.detune.value = 0.0 * 1200.0 * spread
        oscillator2.detune.value = -0.004 * 1200.0 * spread
        oscillator3.detune.value = 0.003 * 1200.0 * spread
      }
    )

    return sum
  }

  _getBaseFrequency() {
    return 146.83 * (this._index + 1.0)
  }

  createMotionModulation(motionModulation) {
    this._motionModulations.push(motionModulation)
  }
}
