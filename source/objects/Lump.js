import icosphere from 'icosphere'
import angleNormals from 'angle-normals'
import {regl, camera} from '../global'

const mesh = icosphere(3)
const normals = angleNormals(mesh.cells, mesh.positions)

export default regl({
  frag: require('../../shaders/thing.frag.glsl'),
  vert: require('../../shaders/thing.vert.glsl'),

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
