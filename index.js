import sequencer from './source/Sequencer'
import {regl} from './source/global'
import {trigger, tap} from './source/World'
import {playSound} from './source/Audio'

sequencer.setCallback(() => {
  playSound()
  trigger()
})

// sequencer.start()

document.getElementsByTagName('canvas')[0].addEventListener(
  'mousedown',
  event => {
    const x = (event.x / window.innerWidth - 0.5) * 2.0
    const y = (event.y / window.innerHeight - 0.5) * 2.0
    const angle = Math.atan2(-y, x)
    tap(angle)
  }
)
