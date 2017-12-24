import {regl} from './global'
import dat from 'dat-gui'
import drawLump from './objects/Lump'
import drawGrid from './objects/Grid'
import drawMote from './objects/Mote'

const displayControls = true
const doPostProcess = false

let umm = 0.0
let decayId

class Settings {
  constructor() {
    this.umm = 0.9
    this.backgroundColor = [75, 12, 150]
    this.shadowColor = [25, 0, 25]
    this.lightAColor = [190, 190, 0]
    this.lightBColor = [0, 255, 100]
  }
}
const settings = new Settings()

if (displayControls) {
  const gui = new dat.GUI()
  gui.add(settings, 'umm', 0.0, 1.0)
  gui.addColor(settings, 'backgroundColor')
  gui.addColor(settings, 'shadowColor')
  gui.addColor(settings, 'lightAColor')
  gui.addColor(settings, 'lightBColor')
}

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

function drawScene() {
  const backgroundColor = [
    settings.backgroundColor[0] / 255.0,
    settings.backgroundColor[1] / 255.0,
    settings.backgroundColor[2] / 255.0,
    1.0
  ]
  regl.clear({
    color: backgroundColor,
    depth: 1
  })
  drawMote({
    shadowColor: floatColor(settings.shadowColor),
    lightAColor: floatColor(settings.lightAColor),
    lightBColor: floatColor(settings.lightBColor)
  })
}

function floatColor(intColor) {
  if (typeof intColor === 'string') {
    const matches = intColor.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/)
    intColor = matches.slice(1, 4).map(string => parseInt(string, 16))
  }
  return intColor.map(value => value / 255.0)
}

regl.frame(({viewportWidth, viewportHeight}) => {
  fbo.resize(viewportWidth, viewportHeight)

  if (!doPostProcess) {
    drawScene()
  } else {
    captureRaw({}, () => drawScene())
    drawProcessed({umm})
  }
})

module.exports = {
  trigger
}
