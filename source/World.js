import graphics from './Graphics'
import audio from './Audio'
import physics from './Physics'

const numObjects = 2


class World {
  constructor() {
    graphics.setNumObjects(numObjects)
    physics.createObjects(numObjects)
    audio.createStrikes(numObjects)
    audio.init()

    graphics.onFrame(() => this._onFrame())

    physics.onObjectStrike(objectIndex => {
      audio.triggerStrike(objectIndex)
      graphics.trigger(objectIndex)
    })

    this._bindEvents()
  }

  _onFrame() {
    physics.step()
  }

  _bindEvents() {
    document.getElementsByTagName('canvas')[0].addEventListener(
      'mousedown',
      event => {
        const x = (event.x / window.innerWidth - 0.5) * 2.0
        const y = (event.y / window.innerHeight - 0.5) * 2.0
        const angle = Math.atan2(-y, x)
        physics.blow(0, angle + Math.PI)
      }
    )
  }
}

export default new World()
