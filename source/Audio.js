import Tone from 'tone'
import StartAudioContext from 'startaudiocontext'

const onSwitch = document.getElementById('start-audio-mobile')
StartAudioContext(Tone.context, "#start-audio-mobile", () => {
  onSwitch.remove()
})

const limiter = new Tone.Limiter({
  threshold: -0.3
}).toMaster()

const masterGain = new Tone.Gain({
  gain: 1.1
}).connect(limiter)

const reverb = new Tone.JCReverb(0.8).connect(masterGain)

const tremolo = new Tone.Chorus({
  frequency: 0.5,
  depth: 0.5
}).connect(reverb)

// filter bank
const filterBank = []
const filterBankBaseFrequency = 500.0
for (let index = 0; index < 15; index++) {
  filterBank.push(
    new Tone.Filter({
      frequency: filterBankBaseFrequency * (index + 1),
      type: 'bandpass',
      rolloff: -12 * Math.pow(2, Math.floor(Math.random() * 4.0))
    }).toMaster()
  )
}

const gain = new Tone.Gain({
  gain: 0.1
}).connect(tremolo)

const env = new Tone.AmplitudeEnvelope({
	attack: 0.05,
	decay: 0.9,
	sustain: 0.04,
	release: 0.0
}).connect(tremolo)

const partials = []
for (let index = 0; index < 15; index++) {
  partials.push(Math.random())
}
const oscillator = new Tone.Oscillator({
	partials,
	type: "custom",
	frequency: "C#2",
	volume: -12,
}).fan(env, gain).start()

var noise = new Tone.Noise({
	volume: -6,
	type: 'white'
})
noise.fan.apply(noise, filterBank)
noise.start()

function playSound() {
  env.triggerAttack()
}

function modulateAmbience(distance) {
  gain.gain.value = 0.25 - 0.5 * Math.min(distance, 0.5)
  noise.volume.value = -48.0 - distance * 36.0
}

module.exports = {
  playSound,
  modulateAmbience
}
