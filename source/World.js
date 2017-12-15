import reglModule from 'regl'
import cameraModule from 'regl-camera'
import icosphere from 'icosphere'
import angleNormals from 'angle-normals'

const regl = reglModule()
const camera = cameraModule(regl, {distance: 3})

const mesh = icosphere(3)
const normals = angleNormals(mesh.cells, mesh.positions)

var drawThing = regl({
  frag: require('../shaders/thing.frag.glsl'),
  vert: require('../shaders/thing.vert.glsl'),

  attributes: {
    position: mesh.positions,
    normal: normals
  },

  elements: mesh.cells,

  uniforms: {
    angle: (context, props) => {
      return props.speed * context.tick
    },
    time: regl.context('time'),
    scale: regl.prop('scale'),
    width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight'),
  }
})

regl.frame(() => {
  regl.clear({
    color: [0.15, 0.15, 0.15, 1.0],
    depth: true
  })
  camera(() => {
    drawThing({
      scale: 0.5,
      speed: 0.005
    })
  })
})
