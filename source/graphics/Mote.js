import icosphere from 'icosphere'
import {regl} from './environment'
import settings from '../settings'
import {floatColor} from '../utils'

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

  draw(objectPosition, moteFloat) {
    const moteBaseProps = {
      lightAColor: floatColor(settings.lightAColor),
      lightBColor: floatColor(settings.lightBColor)
    }

    this._render(
      Object.assign(
        {
          hue: moteFloat,
          objectPosition,
          scale: settings.objectScale + 0.05 * this._decay
        },
        moteBaseProps
      )
    )
  }

  _initDraw() {
    this._render = regl({
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
}
