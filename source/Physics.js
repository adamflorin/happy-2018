class Physics {
  constructor() {
    this._object = {
      position: {
        x: 0.0,
        y: 0.0
      },
      forces: {
        wind: {
          angle: 0.0,
          force: 0.0
        },
        gravity: {
          angle: 0.0,
          force: 0.0
        }
      }
    }
  }

  blow(angle) {
    this._object.forces.wind.angle = angle
    this._object.forces.wind.force = 0.01
  }

  getObjectPosition() {
    return [this._object.position.x, this._object.position.y]
  }

  step() {
    let x = this._object.position.x
    let y = this._object.position.y

    // apply wind
    if (this._object.forces.wind.force > 0.0) {
      this._object.forces.wind.force *= 0.98
      let windAngle = this._object.forces.wind.angle
      let windForce = this._object.forces.wind.force
      x += Math.cos(windAngle) * windForce
      y += Math.sin(windAngle) * windForce
    }

    // apply gravity
    const gravityInertia = 0.9
    let newGravityAngle = this._wrapRadians(Math.atan2(y, x) + Math.PI)
    const newGravityDistance = Math.sqrt(x * x + y * y)
    if (newGravityDistance > 0.0) {
      // set gravity force (with inertia)
      let newGravityForce = Math.pow(0.01 / newGravityDistance, 1.0)
      newGravityForce = Math.min(0.005, newGravityForce)
      this._object.forces.gravity.force =
        (this._object.forces.gravity.force * gravityInertia) +
        (1.0 - gravityInertia) * newGravityForce
      document.getElementById('level').style.height =
        ('' + (this._object.forces.gravity.force / 0.01 * 100.0) + '%')

      // set gravity angle (with inertia)
      while (Math.abs(newGravityAngle - this._object.forces.gravity.angle) > Math.PI) {
        const increase = (this._object.forces.gravity.angle > newGravityAngle)
        newGravityAngle += (2.0 * Math.PI) * (increase ? 1.0 : -1.0)
      }
      this._object.forces.gravity.angle =
        (this._object.forces.gravity.angle * gravityInertia) +
        (1.0 - gravityInertia) * newGravityAngle

      // apply gravity
      let gravityAngle = this._object.forces.gravity.angle
      let gravityForce = this._object.forces.gravity.force
      x += Math.cos(gravityAngle) * gravityForce
      y += Math.sin(gravityAngle) * gravityForce
    }

    this._object.position.x = x
    this._object.position.y = y
  }

  _wrapRadians(rad) {
    rad = rad % (Math.PI * 2.0)
    if (rad > Math.PI) {
      rad -= Math.PI * 2.0
    }
    return rad
  }
}

export default new Physics()
