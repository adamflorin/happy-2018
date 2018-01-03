import Stats from 'stats-js'
import graphics from './Graphics'
import audio from './Audio'
import physics from './Physics'

const numObjects = 3

class World {
  constructor() {
    this._devMode = true
    if (this._devMode) {
      this._initStats()
    }

    graphics.setNumObjects(numObjects)
    physics.createObjects(numObjects)
    audio.createSounds(numObjects)
    audio.init()

    graphics.onFrame(() => this._onFrame())

    physics.onObjectStrike(objectIndex => {
      audio.triggerStrike(objectIndex)
      graphics.trigger(objectIndex)
    })

    this._bindEvents()
  }

  _onFrame() {
    if (this._devMode) {
      this._stats.begin()
    }

    physics.step()

    for (let index = 0; index < numObjects; index++) {
      let distance = physics.getObjectGravityDistance(index)
      audio.updateDistance(index, distance)
    }

    if (this._devMode) {
      this._stats.end()
    }
  }

  _bindEvents() {
    // wind
    document.getElementsByTagName('canvas')[0].addEventListener(
      'mousedown',
      event => {
        const x = (event.x / window.innerWidth - 0.5) * 2.0
        const y = (event.y / window.innerHeight - 0.5) * 2.0
        const angle = Math.atan2(-y, x)
        physics.blow(0, angle + Math.PI)
      }
    )

    // mute
    document.addEventListener('keyup', event => {
      if (event.key === ' ') {
        audio.toggleMute()
      }
    })
  }

  _initStats() {
    this._stats = new Stats()
    this._stats.domElement.style.position = 'absolute'
    this._stats.domElement.style.right = '275px'
    this._stats.domElement.style.top = 0
    document.body.appendChild(this._stats.domElement)
  }
}

export default new World()
