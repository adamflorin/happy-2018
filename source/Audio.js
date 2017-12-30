import Tone from 'tone'
import StartAudioContext from 'startaudiocontext'
import strike from './sounds/Strike'

class Audio {
  constructor() {
    //
  }

  init() {
    this._initMobileSwitch()
    this._initMixer()
  }

  _initMobileSwitch() {
    const onSwitch = document.getElementById('start-audio-mobile')
    StartAudioContext(Tone.context, "#start-audio-mobile", () => {
      onSwitch.remove()
    })
  }

  _initMixer() {
    // master limiter
    const masterLimiter = new Tone.Limiter({
      threshold: -6.0
    }).toMaster()

    // master gain
    const masterGain = new Tone.Gain({
      gain: 1.1
    }).connect(masterLimiter)

    strike.connect(masterGain)
  }

  triggerStrike() {
    strike.trigger()
  }
}

export default new Audio()
