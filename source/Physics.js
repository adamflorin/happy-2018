import settings from './settings'
import {mix, wrapRadians, computeDelta} from './utils'

const numObjects = 1

class Physics {
  constructor() {
    this._initObjects()
  }

  blow(objectIndex, angle) {
    let firstObject = this._objects[objectIndex]
    firstObject.forces.wind.angle = angle
    firstObject.forces.wind.magnitude = settings.initialWindForce
  }

  getObjectPosition(objectIndex) {
    let object = this._objects[objectIndex]
    return [object.position.x, object.position.y]
  }

  getObjectGravityDistance(objectIndex) {
    let object = this._objects[objectIndex]
    let x = object.position.x
    let y = object.position.y
    return Math.sqrt(x * x + y * y)
  }

  step() {
    this._objects.forEach((object, objectIndex) => {
      this._stepObject(object, objectIndex)
    })
  }

  _initObjects() {
    this._objects = []
    for (let index = 0; index < numObjects; index++) {
      this._objects.push(this._initObject())
    }
  }

  _initObject() {
    return {
      position: {
        x: 0.0,
        y: 0.0
      },
      lastDelta: {
        x: 0.0,
        y: 0.0
      },
      forces: {
        wind: {
          angle: 0.0,
          magnitude: 0.0
        },
        gravity: {
          angle: 0.0,
          magnitude: 0.0
        }
      }
    }
  }

  _stepObject(object, objectIndex) {
    let x = object.position.x
    let y = object.position.y

    // compute wind force
    object.forces.wind.magnitude *= settings.windForceDecay
    if (object.forces.wind.magnitude < 0.001) {
      object.forces.wind.magnitude = 0.0
    }

    // compute gravity force
    object.forces.gravity.angle = wrapRadians(Math.atan2(y, x) + Math.PI)
    const newGravityDistance = this.getObjectGravityDistance(objectIndex)
    if (newGravityDistance > 0.01) {
      object.forces.gravity.magnitude = settings.gravityForceNumerator / newGravityDistance
      object.forces.gravity.magnitude = Math.min(settings.maxGravityForce, object.forces.gravity.magnitude)
    } else {
      object.forces.gravity.magnitude = 0.0
    }

    // sum force deltas
    const windDelta = computeDelta(object.forces.wind)
    const gravityDelta = computeDelta(object.forces.gravity)
    const newSumDelta = {
      x: (windDelta.x + gravityDelta.x),
      y: (windDelta.y + gravityDelta.y)
    }

    // apply inertia to delta
    object.lastDelta = {
      x: mix(object.lastDelta.x, newSumDelta.x, settings.gravityInertia),
      y: mix(object.lastDelta.y, newSumDelta.y, settings.gravityInertia)
    }

    // apply delta
    object.position.x += object.lastDelta.x
    object.position.y += object.lastDelta.y
  }
}

export default new Physics()
