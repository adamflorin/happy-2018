import {regl} from './global'
import settings from './settings'
import physics from './Physics'
import seeThroughCamera from './graphics/Camera'
import drawFirmament from './graphics/Firmament'
import drawMote from './graphics/Mote'

const doPostProcess = true

class Graphics {
  constructor() {
    this._decay = 0.0
    this._decayIntervalId

    this._fbo = regl.framebuffer({
      color: regl.texture({
        width: 1,
        height: 1,
        wrap: 'clamp'
      }),
      depth: true
    })

    this._captureRaw = regl({
      cull: {
        enable: true
      },
      framebuffer: this._fbo
    })

    this._drawProcessed = regl({
      vert: require('../shaders/post.vert.glsl'),
      frag: require('../shaders/post.frag.glsl'),
      attributes: {
        position: [ -4, -4, 4, -4, 0, 4 ] // lol render in oversized triangle
      },
      uniforms: {
        tex: () => this._fbo,
        time: regl.context('time'),
        width: regl.context('viewportWidth'),
        height: regl.context('viewportHeight')
      },
      depth: {enable: false},
      count: 3
    })

    regl.frame(context => this._onFrame(context))
  }

  setNumObjects(numObjects) {
    this._numObjects = numObjects
  }

  onStep(callback) {
    this._stepCallback = callback
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

  _onFrame({viewportWidth, viewportHeight}) {
    this._fbo.resize(viewportWidth, viewportHeight)

    physics.step()

    if (this._stepCallback) {
      this._stepCallback()
    }

    if (!doPostProcess) {
      this._drawScene()
    } else {
      this._captureRaw({}, () => this._drawScene())
      this._drawProcessed()
    }
  }

  _drawScene() {
    let eye = [0.0, 1.0, 3.0]
    let center = [0.0, 0.0, 0.0]
    let up = [0.0, 1.0, 0.0]

    seeThroughCamera(
      {eye, center, up},
      () => {
        regl.clear({
          color: this._floatColor(settings.backgroundColor).concat([1.0]),
          depth: 1
        })

        drawFirmament({
          zenithColor: [0.6, 0.0, 0.3],
          horizonColor: [0.4, 0.4, 0.9]
        })

        const moteBaseProps = {
          shadowColor: this._floatColor(settings.shadowColor),
          lightAColor: this._floatColor(settings.lightAColor),
          lightBColor: this._floatColor(settings.lightBColor)
        }
        const moteProps = []
        for (var index = 0; index < this._numObjects; index++) {
          moteProps.push(
            Object.assign(
              {
                objectPosition: physics.getObjectPosition(index),
                scale: settings.objectScale + 0.05 * this._decay
              },
              moteBaseProps
            )
          )
        }
        drawMote(moteProps)
      }
    )
  }

  _floatColor(intColor) {
    if (typeof intColor === 'string') {
      const matches = intColor.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/)
      intColor = matches.slice(1, 4).map(string => parseInt(string, 16))
    }
    return intColor.map(value => value / 255.0)
  }
}

export default new Graphics()
