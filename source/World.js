import Stats from 'stats-js'
import Graphics from './Graphics'
import audio from './Audio'
import physics from './Physics'

const devMode = true
const renderGraphics = true
const numObjects = 2

let graphics

if (renderGraphics) {
  graphics = new Graphics()
}

class World {
  constructor() {
    if (devMode) {
      this._initStats()
    }

    if (renderGraphics) {
      graphics.setNumObjects(numObjects)
    }
    physics.createObjects(numObjects)
    audio.createSounds(numObjects)
    audio.init()

    if (renderGraphics) {
      graphics.onFrame(() => this._onFrame())
    } else {
      requestAnimationFrame(() => this._onFrame())
    }

    physics.onObjectStrike(objectIndex => {
      audio.triggerStrike(objectIndex)
      if (renderGraphics) {
        graphics.trigger(objectIndex)
      }
    })

    this._bindEvents()
  }

  _onFrame() {
    if (!renderGraphics) {
      requestAnimationFrame(() => this._onFrame())
    }

    if (devMode) {
      this._stats.begin()
    }

    physics.step()

    for (let index = 0; index < numObjects; index++) {
      let distance = physics.getObjectGravityDistance(index)
      audio.updateDistance(index, distance)
    }

    if (devMode) {
      this._stats.end()
    }
  }

  _bindEvents() {
    // wind
    if (renderGraphics) {
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
