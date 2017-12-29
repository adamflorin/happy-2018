import settings from './settings'

class Physics {
  constructor() {
    this._object = {
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

  blow(angle) {
    this._object.forces.wind.angle = angle
    this._object.forces.wind.magnitude = settings.initialWindForce
  }

  getObjectPosition() {
    return [this._object.position.x, this._object.position.y]
  }

  step() {
    let x = this._object.position.x
    let y = this._object.position.y

    // compute wind force
    this._object.forces.wind.magnitude *= settings.windForceDecay
    if (this._object.forces.wind.magnitude < 0.001) {
      this._object.forces.wind.magnitude = 0.0
    }

    // compute gravity force
    this._object.forces.gravity.angle = this._wrapRadians(Math.atan2(y, x) + Math.PI)
    const newGravityDistance = this.objectGravityDistance()
    if (newGravityDistance > 0.01) {
      this._object.forces.gravity.magnitude = settings.gravityForceNumerator / newGravityDistance
      this._object.forces.gravity.magnitude = Math.min(settings.maxGravityForce, this._object.forces.gravity.magnitude)
    } else {
      this._object.forces.gravity.magnitude = 0.0
    }

    // sum force deltas
    const windDelta = this._computeDelta(this._object.forces.wind)
    const gravityDelta = this._computeDelta(this._object.forces.gravity)
    const newSumDelta = {
      x: (windDelta.x + gravityDelta.x) / 2.0,
      y: (windDelta.y + gravityDelta.y) / 2.0
    }

    // apply inertia to delta
    this._object.lastDelta = {
      x: this._mixFloat(this._object.lastDelta.x, newSumDelta.x, settings.gravityInertia),
      y: this._mixFloat(this._object.lastDelta.y, newSumDelta.y, settings.gravityInertia)
    }

    // apply delta
    this._object.position.x += this._object.lastDelta.x
    this._object.position.y += this._object.lastDelta.y
  }

  objectGravityDistance() {
    let x = this._object.position.x
    let y = this._object.position.y
    return Math.sqrt(x * x + y * y)
  }

  _mixFloat(from, to, mix) {
    return (from * mix) + (1.0 - mix) * to
  }

  _wrapRadians(rad) {
    rad = rad % (Math.PI * 2.0)
    if (rad > Math.PI) {
      rad -= Math.PI * 2.0
    }
    return rad
  }

  _computeDelta(force) {
    return {
      x: Math.cos(force.angle) * force.magnitude,
      y: Math.sin(force.angle) * force.magnitude
    }
  }
}

export default new Physics()
