import {regl} from './global'
import drawLump from './objects/Lump'

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

    drawLump([
      {
        scale: 0.3,
        speed: 0.005
      },
      {
        scale: 0.3,
        speed: -0.002
      },
      {
        scale: 0.3,
        speed: 0.009
      }
    ])
  })
  drawProcessed()
})
