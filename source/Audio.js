import Tone from 'tone'
import StartAudioContext from 'startaudiocontext'
import Strike from './sounds/Strike'

class Audio {
  constructor() {
    this._strikes = []
    this._initMobileSwitch()
  }

  createStrikes(numStrikes) {
    for (var index = 0; index < numStrikes; index++) {
      this._strikes.push(new Strike(index))
    }
  }

  init() {
    this._initMixer()
    this._strikes.forEach(strike => {
      strike.connect(this._masterGain)
    })
  }

  _initMobileSwitch() {
    const onSwitch = document.getElementById('start-audio-mobile')
    StartAudioContext(Tone.context, "#start-audio-mobile", () => {
      onSwitch.remove()
    })
  }

  _initMixer() {
    this._masterLimiter = new Tone.Limiter({
      threshold: -6.0
    }).toMaster()

    this._masterGain = new Tone.Gain({
      gain: 1.1
    }).connect(this._masterLimiter)
  }

  triggerStrike(objectIndex) {
    this._strikes[objectIndex].trigger()
  }
}

export default new Audio()
