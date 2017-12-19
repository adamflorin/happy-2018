import Tone from 'tone'

const bpm = 120.0
const QUARTER_NOTE_MS = 60000.0 / bpm * 0.25

var synth = new Tone.Synth().toMaster();

var lastTime

Tone.context.updateInterval = 0.005 // s

Tone.Transport.bpm.value = bpm;

// Measure time delta since last call, warn if early or late
// tickTime is transport time in seconds (= useless)
function measureInterval(tickTime) {
  // synth.triggerAttackRelease("C4", "8n");
  var currentTime = Date.now()
  if (lastTime !== undefined) {
    const deltaTime = currentTime - lastTime
    const errorTime = deltaTime - QUARTER_NOTE_MS
    if (errorTime > 0.0) {
      console.warn("Transport fired", errorTime, "ms LATE");
    } else if (errorTime < 0.0) {
      console.warn("Transport fired", -errorTime, "ms EARLY");
    }
  }
  lastTime = currentTime
}

Tone.Transport.scheduleRepeat(measureInterval, "16n")

Tone.Transport.start()
