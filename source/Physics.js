import settings from './settings'
import {mix, wrapRadians, computeDelta} from './utils'

const objectGravityDistanceThreshold = 0.01

class Physics {
  constructor() {
    this._objects = []
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

      let objectWasStable = object.stable
      let objectGravityDistance = this.getObjectGravityDistance(objectIndex)
      object.stable = (objectGravityDistance < objectGravityDistanceThreshold)

      if (objectWasStable && !object.stable) {
        this._objectStrikeCallback(objectIndex)
      }

      if (!objectWasStable && object.stable) {
        this._objects.forEach((receivingObject, receivingObjectIndex) => {
          if (receivingObjectIndex === objectIndex) {
            return
          } else if (receivingObject.stable) {
            receivingObject.forces.wind = {
              angle: wrapRadians(object.forces.gravity.angle),
              magnitude: settings.initialWindForce
            }
          }
        })
      }
    })
  }

  onObjectStrike(objectStrikeCallback) {
    this._objectStrikeCallback = objectStrikeCallback
  }

  createObjects(numObjects) {
    for (let index = 0; index < numObjects; index++) {
      const object = this._createObject()
      object.position.x = (index - 1.0) * Math.random()
      object.position.y = Math.random() * 4.0 - 2.0
      this._objects.push(object)
    }
  }

  _createObject() {
    return {
      position: {
        x: 0.0,
        y: 0.0
      },
      stable: true,
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
