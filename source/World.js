import {regl} from './global'
import dat from 'dat-gui'
import drawLump from './objects/Lump'
import drawGrid from './objects/Grid'

let umm = 0.0
let decayId

class Settings {
  constructor() {
    this.umm = 0.9
  }
}
const settings = new Settings()
const gui = new dat.GUI()
gui.add(settings, 'umm', 0.0, 1.0)

function trigger() {
  umm = 1.0
  clearInterval(decayId)
  decayId = setInterval(
    () => {
      umm -= 0.05
      if (umm < 0.0) {
        umm = 0.0
        clearInterval(decayId)
      }
    },
    1000.0 / 60.0
  )
}

const fbo = regl.framebuffer({
  color: regl.texture({
    width: 1,
    height: 1,
    wrap: 'clamp'
  }),
  depth: true
})

const captureRaw = regl({
  cull: {
    enable: true
  },
  framebuffer: fbo
})

const drawProcessed = regl({
  vert: require('../shaders/world.vert.glsl'),
  frag: require('../shaders/world.frag.glsl'),
  attributes: {
    position: [ -4, -4, 4, -4, 0, 4 ] // lol render in oversized triangle
  },
  uniforms: {
    tex: () => fbo,
    umm: regl.prop('umm'),
    time: regl.context('time')
  },
  depth: {enable: false},
  count: 3
})

regl.frame(({viewportWidth, viewportHeight}) => {
  fbo.resize(viewportWidth, viewportHeight)

  captureRaw({}, () => {
    regl.clear({
      color: [0.15, 0.15, 0.15, 1.0],
      depth: 1
    })
    drawGrid()
  })
  drawProcessed({umm})
})

module.exports = {
  trigger
}
