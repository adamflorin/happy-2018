import {regl} from './global'
import settings from './settings'
import physics from './Physics'
import drawLump from './objects/Lump'
import drawGrid from './objects/Grid'
import drawMote from './objects/Mote'

const doPostProcess = true

let decay = 0.0
let decayIntervalId

function tap(angle) {
  physics.blow(angle + Math.PI)
}

function trigger() {
  decay = 1.0
  clearInterval(decayIntervalId)
  decayIntervalId = setInterval(
    () => {
      decay -= 0.05
      if (decay < 0.0) {
        decay = 0.0
        clearInterval(decayIntervalId)
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
    time: regl.context('time'),
    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight')
  },
  depth: {enable: false},
  count: 3
})

function drawScene() {
  regl.clear({
    color: floatColor(settings.backgroundColor).concat([1.0]),
    depth: 1
  })
  drawMote({
    shadowColor: floatColor(settings.shadowColor),
    lightAColor: floatColor(settings.lightAColor),
    lightBColor: floatColor(settings.lightBColor),
    objectPosition: physics.getObjectPosition()
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

  physics.step()

  if (!doPostProcess) {
    drawScene()
  } else {
    captureRaw({}, () => drawScene())
    drawProcessed({decay})
  }
})

module.exports = {
  trigger,
  tap
}
