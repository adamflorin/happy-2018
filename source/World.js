import Stats from 'stats-js'
import multiply from 'gl-mat4/multiply'
import invert from 'gl-mat4/invert'
import vec3 from 'gl-vec3'
import {viewMatrix, projectionMatrix, eye} from './graphics/Camera'
import Graphics from './Graphics'
import audio from './Audio'
import physics from './Physics'
import {displayControls} from './settings'

const devMode = false
const renderGraphics = true
const numObjects = 5

let graphics

if (renderGraphics) {
  graphics = new Graphics()
}

class World {
  constructor() {
    if (devMode) {
      this._initStats()
      displayControls()
    }

    if (renderGraphics) {
      graphics.createObjects(numObjects)
    }
    physics.createObjects(numObjects)
    audio.createSounds(numObjects)
    audio.init()

    if (renderGraphics) {
      graphics.beforeFrame(() => this._onFrame())
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
    audio.modulateModion()

    if (devMode) {
      this._stats.end()
    }
  }

  _bindEvents() {
    // wind
    if (renderGraphics) {
      const canvas = document.getElementsByTagName('canvas')[0]

      if ('ontouchstart' in document.documentElement) {
        // mobile
        canvas.addEventListener('touchstart', event => {
          const touchIndex = event.touches.length - 1
          this._handleTap({
            x: event.touches[touchIndex].screenX,
            y: event.touches[touchIndex].screenY
          })
        })
      } else {
        // desktop
        canvas.addEventListener('mousedown', event => {
          this._handleTap({x: event.x, y: event.y})
        }
      )}
    }

    // mute
    if (devMode) {
      document.addEventListener('keyup', event => {
        if (event.key === ' ') {
          audio.toggleMute()
        }
      })
    }
  }

  _handleTap(point) {
    const windowWidth = window.innerWidth * window.devicePixelRatio
    const windowHeight = window.innerHeight * window.devicePixelRatio

    const screenX = 2.0 * (point.x / window.innerWidth - 0.5)
    const screenY = -2.0 * (point.y / window.innerHeight - 0.5)

    const yPlanePosition = this._screenToYPlane(screenX, screenY)
    physics.blow(yPlanePosition)
  }

  _screenToYPlane(screenX, screenY) {
    const viewProjectionMatrix = multiply([], projectionMatrix, viewMatrix)
    const inverseViewProjectionMatrix = invert([], viewProjectionMatrix)
    const rayPoint = vec3.transformMat4(
      [],
      [screenX, screenY, 0.0],
      inverseViewProjectionMatrix
    )

    let deltaY = eye[1] - rayPoint[1]
    deltaY = Math.max(0.001, deltaY) // treat taps above horizon as on horizon
    let deltaZ = eye[2] - rayPoint[2]
    let slopeZ = deltaZ / deltaY
    let realZ = eye[2] - eye[1] * slopeZ

    let deltaX = eye[0] - rayPoint[0]
    let slopeX = deltaX / deltaY
    let realX = eye[0] - eye[1] * slopeX

    return {x: realX, y: -realZ}
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
