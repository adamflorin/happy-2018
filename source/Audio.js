import Tone from 'tone'
import StartAudioContext from 'startaudiocontext'
import Strike from './sounds/Strike'
import Flutter from './sounds/Flutter'

class Audio {
  constructor() {
    this._strikes = []
    this._flutters = []
    // Tone.Master.mute = true
    this._initMobileSwitch()
  }

  createSounds(numStrikes) {
    for (var index = 0; index < numStrikes; index++) {
      this._strikes.push(new Strike(index))
      this._flutters.push(new Flutter(index))
    }
  }

  init() {
    this._initMixer()
    this._strikes.forEach(strike => {
      strike.connect(this._masterGain)
    })
    this._flutters.forEach(flutter => {
      flutter.connect(this._masterGain)
    })
  }

  toggleMute() {
    Tone.Master.mute = !Tone.Master.mute
  }

  triggerStrike(objectIndex) {
    this._strikes[objectIndex].trigger()
  }

  updateDistance(objectIndex, distance) {
    this._flutters[objectIndex].updateDistance(distance)
  }

  _initMobileSwitch() {
    const onSwitch = document.getElementById('start-audio-mobile')
    StartAudioContext(Tone.context, '#start-audio-mobile', () => {
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
}

export default new Audio()
