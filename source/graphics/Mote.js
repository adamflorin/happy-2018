import icosphere from 'icosphere'
import {regl} from './environment'

export default class Mote {
  constructor() {
    this._mesh = icosphere(1)

    this._distortions = []
    this._mesh.positions.forEach(position => {
      this._distortions.push(Math.random())
    })

    this._decay = 0.0
    this._decayIntervalId = null

    this._initDraw()
  }

  _initDraw() {
    this.draw = regl({
      frag: require('../../shaders/mote.frag.glsl'),
      vert: require('../../shaders/mote.vert.glsl'),

      attributes: {
        position: this._mesh.positions,
        distortion: this._distortions,
      },
      elements: this._mesh.cells,

      uniforms: {
        time: regl.context('time'),
        hue: regl.prop('hue'),
        lightAColor: regl.prop('lightAColor'),
        lightBColor: regl.prop('lightBColor'),
        objectPosition: regl.prop('objectPosition'),
        scale: regl.prop('scale')
      },

      blend: {
        enable: true,
        func: {
          src: 'src alpha',
          dst: 'one minus src alpha'
        },
        equation: 'add'
      }
    })
  }

  trigger() {
    this._decay = 1.0
    clearInterval(this._decayIntervalId)
    this._decayIntervalId = setInterval(
      () => {
        this._decay -= 0.05
        if (this._decay < 0.0) {
          this._decay = 0.0
          clearInterval(this._decayIntervalId)
        }
      },
      1000.0 / 60.0
    )
  }

  getDecay() {
    return this._decay
  }
}
