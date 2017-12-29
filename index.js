import {regl} from './source/global'
import physics from './source/Physics'
import world from './source/World'
import {playSound} from './source/Audio'

document.getElementsByTagName('canvas')[0].addEventListener(
  'mousedown',
  event => {
    const x = (event.x / window.innerWidth - 0.5) * 2.0
    const y = (event.y / window.innerHeight - 0.5) * 2.0
    const angle = Math.atan2(-y, x)
    physics.blow(angle + Math.PI)
  }
)
