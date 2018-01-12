import {settings} from './settings'
import {lerp, mix, wrapRadians, computeDelta, magnitude, angle} from './utils'

const objectGravityDistanceThreshold = 0.01

class Physics {
  constructor() {
    this._objects = []
  }

  blow(windPosition) {
    const windObject = this._findNearestObject(windPosition)
    let windVector = {
      x: windObject.position.x - windPosition.x,
      y: windObject.position.y - windPosition.y
    }
    windObject.forces.wind.angle = angle(windVector)
    let scaledDistance = magnitude(windVector) / (settings.maxDistance * 5.0)
    scaledDistance = Math.min(1.0, scaledDistance)
    windObject.forces.wind.magnitude = settings.windForce * (1.0 - scaledDistance)
  }

  getObject(objectIndex) {
    return this._objects[objectIndex]
  }

  getObjectGravityDistance(objectIndex) {
    let object = this._objects[objectIndex]
    let x = object.position.x
    let y = object.position.y
    return Math.sqrt(x * x + y * y)
  }

  step(time, devMode) {
    const intensity = this._calculateIntensity(time)
    const params = {
      windForceDecay: devMode ? settings.windForceDecay : lerp(0.96, 0.76, Math.pow(intensity, 8.0)),
      maxDistance: devMode ? settings.maxDistance : lerp(1.5, 0.04, intensity)
    }

    this._objects.forEach((object, objectIndex) => {
      this._stepObject(object, objectIndex, params)

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
              magnitude: settings.strikeForce
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
    const frontAngleGap = Math.PI * 1.0
    const angleRange = Math.PI * 2.0 - frontAngleGap
    const angleOffset = (angleRange - Math.PI) / 2.0
    for (let index = 0; index < numObjects; index++) {
      const indexFloat = index / numObjects;
      const object = this._createObject()
      const angle = (indexFloat * angleRange) - angleOffset
      const distance = (1.0 - indexFloat) * (settings.maxDistance * 1.0)
      object.position.x = Math.cos(angle) * distance
      object.position.y = Math.sin(angle) * distance
      this._objects.push(object)
    }
  }

  _createObject() {
    return {
      position: {
        x: 0.0,
        y: 0.0
      },
      stable: false,
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

  _stepObject(object, objectIndex, {windForceDecay, maxDistance}) {
    let x = object.position.x
    let y = object.position.y

    // compute wind force
    object.forces.wind.magnitude *= windForceDecay
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

    // limit position
    const newDistance = magnitude(object.position)
    const scalePosition = newDistance / maxDistance
    if (scalePosition >= 1.0) {
      object.position.x /= scalePosition
      object.position.y /= scalePosition
    }
  }

  _findNearestObject(fromPosition) {
    let nearestIndex
    let shortestDistance = 9999.0
    this._objects.forEach(({position}, index) => {
      let vector = {
        x: position.x - fromPosition.x,
        y: position.y - fromPosition.y
      }
      let distance = magnitude(vector)
      if (distance < shortestDistance) {
        nearestIndex = index
        shortestDistance = distance
      }
    })
    return this._objects[nearestIndex]
  }

  _calculateIntensity(time) {
    return Math.abs(
      ((((time / settings.rotationPeriod) + 0.25) % 1.0) * 2.0) - 1.0
    )
  }
}

export default new Physics()
