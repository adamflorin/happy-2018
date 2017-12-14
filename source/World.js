import reglModule from 'regl'

const regl = reglModule()

var drawThing = regl({
  frag: require('../shaders/thing.frag.glsl'),
  vert: require('../shaders/thing.vert.glsl'),

  attributes: {
    position: [[0, -1], [-1, 0], [1, 1]]
  },

  uniforms: {
    angle: (context, props) => props.speed * context.tick,
    scale: regl.prop('scale'),
    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight'),
  },

  count: 3
})

regl.frame(() => {
  regl.clear({
    color: [0, 0, 0, 1]
  })
  drawThing({
    scale: 0.2,
    speed: 0.02
  })
})
