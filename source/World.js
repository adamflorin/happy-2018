import Stats from 'stats-js'
import multiply from 'gl-mat4/multiply'
import invert from 'gl-mat4/invert'
import vec3 from 'gl-vec3'
import {viewMatrix, projectionMatrix, eye} from './graphics/Camera'
import graphics from './Graphics'
import audio from './Audio'
import physics from './Physics'
import messages from './Messages'
import {settings, displayControls} from './settings'

const devMode = false
let lofi = false
let numObjects = 4
const waitBeforeBeginDuration = 350
const rotationPeriod = 10.0

class World {
  constructor() {
    if (devMode) {
      this._initStats()
      displayControls()
    }

    if (location.search.match(/lofi/)) {
      lofi = true
      numObjects = 3
    }

    this._messagedStorm = false

    physics.createObjects(numObjects)
    graphics.createObjects(numObjects)
    audio.createSounds(numObjects)
    audio.init(lofi)

    graphics.beforeFrame(time => this._onFrame(time))
    physics.onObjectStrike(objectIndex => {
      audio.triggerStrike(objectIndex)
      graphics.trigger(objectIndex)
    })
    this._bindEvents()

    setTimeout(() => this.begin(), waitBeforeBeginDuration)
  }

  begin() {
    this._getCanvas().classList.add('on')

    audio.begin()

    setTimeout(() => messages.begin(), 500)
  }

  _onFrame(time) {
    if (devMode) {
      this._stats.begin()
    }

    physics.step(time, devMode)
    audio.modulateModion()
    if (!this._messagedStorm && (time / settings.rotationPeriod > 0.6)) {
      messages.explainStorm()
      this._messagedStorm = true
    }

    if (devMode) {
      this._stats.end()
    }
  }

  _bindEvents() {
    // wind
    if ('ontouchstart' in document.documentElement) {
      // mobile
      this._getCanvas().addEventListener('touchstart', event => {
        event.preventDefault()
        const touchIndex = event.touches.length - 1
        this._handleTap({
          x: event.touches[touchIndex].screenX,
          y: event.touches[touchIndex].screenY
        })
      })
    } else {
      // desktop
      this._getCanvas().addEventListener('mousedown', event => {
        event.preventDefault()
        this._handleTap({x: event.x, y: event.y})
      }
    )}

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

    messages.tapped()

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

  _getCanvas() {
    return document.querySelector('canvas')
  }
}

export default new World()
