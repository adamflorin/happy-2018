import sequencer from './source/Sequencer.js'
import {trigger} from './source/World.js'
import {playSound} from './source/Audio.js'

sequencer.setCallback(() => {
  playSound()
  trigger()
})

sequencer.start()
