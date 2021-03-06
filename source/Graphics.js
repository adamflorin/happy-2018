import {regl} from './graphics/environment'
import {settings} from './settings'
import physics from './Physics'
import {seeThroughCamera} from './graphics/Camera'
import drawFirmament from './graphics/Firmament'
import Mote from './graphics/Mote'
import {floatColor} from './utils'

const doPostProcess = false

class Graphics {
  constructor() {
    this._motes = []

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

  createObjects(numObjects) {
    this._numObjects = numObjects

    for (let index = 0; index < numObjects; index++) {
      const mote = new Mote(index)
      this._motes.push(mote)
    }
  }

  beforeFrame(callback) {
    this._beforeFrameCallback = callback
  }

  trigger(objectIndex) {
    this._motes[objectIndex].trigger()
  }

  _onFrame({viewportWidth, viewportHeight, time}) {
    if (this._beforeFrameCallback) {
      this._beforeFrameCallback(time)
    }

    this._fbo.resize(viewportWidth, viewportHeight)

    if (!doPostProcess) {
      this._drawScene()
    } else {
      this._captureRaw({}, () => this._drawScene())
      this._drawProcessed()
    }
  }

  _drawScene() {
    seeThroughCamera(
      {},
      () => {
        regl.clear({
          color: floatColor(settings.backgroundColor).concat([1.0]),
          depth: 1
        })

        drawFirmament({rotationPeriod: settings.rotationPeriod})

        this._motes.forEach((mote, moteIndex) => {
          const {position} = physics.getObject(moteIndex)
          mote.draw([position.x, position.y])
        })
      }
    )
  }
}

export default new Graphics()
