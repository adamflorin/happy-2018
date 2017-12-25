class Physics {
  constructor() {
    this._object = {
      position: {
        x: 0.0,
        y: 0.0
      }
    }
    this._wind = {
      angle: 0.0,
      force: 0.0
    }
  }

  blow(angle) {
    this._wind.angle = angle
    this._wind.force = 0.01
  }

  getObjectPosition() {
    return [this._object.position.x, this._object.position.y]
  }

  step() {
    this._object.position.x += Math.cos(this._wind.angle) * this._wind.force
    this._object.position.y += Math.sin(this._wind.angle) * this._wind.force
    this._wind.force *= 0.98
  }
}

export default new Physics()
