class Sequencer {
  constructor() {
  }

  setCallback(callback) {
    this._callback = callback
  }

  start() {
    this._scheduleTick()
    this._startAt = Date.now()
  }

  stop() {
    clearTimeout(this._timeoutId)
  }

  _scheduleTick() {
    const elapsedTime = Date.now() - this._startAt
    const interval = 500 + 400.0 * Math.sin(elapsedTime / 1000.0)
    this._timeoutId = setTimeout(() => this._tick(), interval)
  }

  _tick() {
    if (this._callback) {
      this._callback()
    }
    this._scheduleTick()
  }
}

export default new Sequencer()
