import './source/global'
import physics from './source/Physics'
import graphics from './source/Graphics'
import audio from './source/Audio'

const numObjects = 2

const objectGravityDistanceThreshold = 0.01

let objectWasStable = true

function init() {
  graphics.setNumObjects(numObjects)
  physics.createObjects(numObjects)
  audio.createStrikes(numObjects)
  audio.init()
}

graphics.onStep(() => {
  let objectGravityDistance = physics.getObjectGravityDistance(0)
  let objectIsStable = (objectGravityDistance < objectGravityDistanceThreshold)

  if (objectWasStable && !objectIsStable) {
    audio.triggerStrike()
    graphics.trigger()
  }

  objectWasStable = objectIsStable
})

document.getElementsByTagName('canvas')[0].addEventListener(
  'mousedown',
  event => {
    const x = (event.x / window.innerWidth - 0.5) * 2.0
    const y = (event.y / window.innerHeight - 0.5) * 2.0
    const angle = Math.atan2(-y, x)
    physics.blow(0, angle + Math.PI)
    physics.blow(1, angle)
  }
)

init()
