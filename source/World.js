import './graphics/environment'
import physics from './Physics'
import graphics from './Graphics'
import audio from './Audio'

const numObjects = 2
const objectGravityDistanceThreshold = 0.01

class World {
  constructor() {
    this._objectWasStable = true

    graphics.setNumObjects(numObjects)
    physics.createObjects(numObjects)
    audio.createStrikes(numObjects)
    audio.init()

    graphics.onStep(() => this._onStep())

    this._bindEvents()
  }

  _onStep() {
    let objectGravityDistance = physics.getObjectGravityDistance(0)
    let objectIsStable = (objectGravityDistance < objectGravityDistanceThreshold)

    if (this._objectWasStable && !objectIsStable) {
      audio.triggerStrike()
      graphics.trigger()
    }

    this._objectWasStable = objectIsStable
  }

  _bindEvents() {
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
  }
}

export default new World()
