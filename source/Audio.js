import Tone from 'tone'
import physics from './Physics'
import Splash from './sounds/Splash'

const fadeInDuration = 1.0 // s

class Audio {
  constructor() {
    this._splashes = []

    // Tone.js context
    // Tone.Context.latencyHint = 'playback'
    // Tone.Master.mute = true
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

  begin() {
    this.output.volume.exponentialRampTo(0.0, fadeInDuration)
  }

  toggleMute() {
    Tone.Master.mute = !Tone.Master.mute
  }

  triggerStrike(objectIndex) {
    this._splashes[objectIndex].trigger()
  }

  modulateModion() {
    this._splashes.forEach((splash, index) => {
      splash.modulateMotion(physics.getObject(index))
    })
  }

  getContext() {
    return Tone.context
  }

  _initMixer() {
    this.output = new Tone.Volume(-96.0).toMaster()

    const limiter = new Tone.Limiter({
      threshold: -0.3
    }).connect(this.output)

    const reverbMix = new Tone.Gain(0.6).connect(limiter)
    const reverb = new Tone.Freeverb({
      roomSize: 0.6,
      dampening: 12000
    }).connect(reverbMix)

    const dryMix = new Tone.Gain(0.4).connect(limiter)
    this.master = new Tone.Compressor({
      ratio: 8.0,
      threshold: -12.0,
      release: 0.5,
      attack: 0.003,
      knee: 30
    }).fan(reverb, dryMix)
  }
}

export default new Audio()
