import Tone from 'tone'

const bpm = 120.0
const QUARTER_NOTE_MS = 60000.0 / bpm * 0.25

var synth = new Tone.MembraneSynth().toMaster();

var lastTime

Tone.context.updateInterval = 0.005 // s

Tone.Transport.bpm.value = bpm;

Tone.Transport.scheduleRepeat(
  () => {
    synth.triggerAttackRelease("C2", "8n")
  },
  "4n"
)

Tone.Transport.start()
