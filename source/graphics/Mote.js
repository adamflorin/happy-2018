import icosphere from 'icosphere'
import {regl} from './environment'
import {settings} from '../settings'
import {floatColor} from '../utils'

export default class Mote {
  constructor(index) {
    this._index = index

    this._initGeometry()

    this._decay = 0.0
    this._decayIntervalId = null

    this._initDraw()
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

  draw(objectPosition, moteFloat) {
    const moteBaseProps = {
      baseColor: floatColor(this._getBaseColor()),
      lightAColor: floatColor(settings.lightAColor),
      lightBColor: floatColor(settings.lightBColor)
    }

    this._render(
      Object.assign(
        {
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
        baseColor: regl.prop('baseColor'),
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

  _initGeometry() {
    this._mesh = icosphere(1)

    this._distortions = []
    this._mesh.positions.forEach(position => {
      this._distortions.push(Math.random())
    })
  }

  _getBaseColor() {
    if (this._index === 0 ) {
      return settings.baseColorA
    } else if (this._index === 1 ) {
      return settings.baseColorB
    } else if (this._index === 2 ) {
      return settings.baseColorC
    } else if (this._index === 3 ) {
      return settings.baseColorD
    } else if (this._index === 4 ) {
      return settings.baseColorE
    }
  }
}
