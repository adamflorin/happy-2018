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

  init(lofi) {
    this._initMixer(lofi)
    this._splashes.forEach(splash => splash.connect(this.master, lofi))
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

  _initMixer(lofi) {
    lofi = true

    let reverbMix
    let reverb

    this.output = new Tone.Volume(-96.0).toMaster()

    const limiter = new Tone.Limiter({
      threshold: -0.6
    }).connect(this.output)

    if (!lofi) {
      reverbMix = new Tone.Gain(0.6).connect(limiter)
      reverb = new Tone.Freeverb({
        roomSize: 0.6,
        dampening: 12000
      }).connect(reverbMix)
    }

    const dryMix = new Tone.Gain(0.6).connect(limiter)
    this.master = new Tone.Compressor({
      ratio: 8.0,
      threshold: -24.0,
      release: 0.5,
      attack: 0.003,
      knee: 30
    })

    if (!lofi) {
      this.master.fan(reverb, dryMix)
    } else {
      this.master.connect(dryMix)
    }
  }
}

export default new Audio()
