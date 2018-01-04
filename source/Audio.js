import Tone from 'tone'
import StartAudioContext from 'startaudiocontext'
import physics from './Physics'
import Splash from './sounds/Splash'

// Tone.Context.latencyHint = 'playback'

class Audio {
  constructor() {
    this._splashes = []
    // Tone.Master.mute = true
    this._initMobileSwitch()
  }

  createSounds(numStrikes) {
    for (var index = 0; index < numStrikes; index++) {
      this._splashes.push(new Splash(index))
    }
  }

  init() {
    this._initMixer()
    this._splashes.forEach(splash => splash.connect(this.master))
  }

  toggleMute() {
    Tone.Master.mute = !Tone.Master.mute
  }

  triggerStrike(objectIndex) {
    this._splashes[objectIndex].trigger()
  }

  updateObjects() {
    this._splashes.forEach((splash, index) => {
      splash.updateObject(physics.getObject(index))
    })
  }

  _initMobileSwitch() {
    const onSwitch = document.getElementById('start-audio-mobile')
    StartAudioContext(Tone.context, '#start-audio-mobile', () => {
      onSwitch.remove()
    })
  }

  _initMixer() {
    this.output = new Tone.Volume(-6.0).toMaster()

    this.reverb = new Tone.Freeverb({
      roomSize: 0.2,
      dampening: 12000
    }).connect(this.output)

    this.master = new Tone.Limiter({
      threshold: -0.3
    }).connect(this.reverb)
  }
}

export default new Audio()
