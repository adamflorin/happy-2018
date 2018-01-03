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
      threshold: -3.0
    }).toMaster()

    this._reverb = new Tone.JCReverb({
      roomSize: 0.6
    }).connect(this._masterLimiter)

    this._compressor = new Tone.Compressor({
      ratio: 12.0,
      threshold: -12.0,
      attack: 0.003,
      release: 0.25,
      knee: 30.0
    }).connect(this._reverb)

    this._masterGain = new Tone.Gain({
      gain: 0.15
    }).connect(this._compressor)
  }
}

export default new Audio()
